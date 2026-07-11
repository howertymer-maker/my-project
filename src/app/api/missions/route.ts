import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import {
  MISSION_TEMPLATES,
  CATEGORY_ORDER,
  getTemplate,
  stageHours,
  stagePoints,
  type MissionTemplate,
  type CategoryKey,
} from "@/lib/mission-templates";

export const dynamic = "force-dynamic";

type MissionState = {
  userMissionId: string | null;
  started: boolean;
  currentStage: number; // 0 = not started
  stageStartedAt: string | null;
  stageReady: boolean;
  completedAt: string | null;
  pointsEarned: number; // points earned so far on this mission
  // 7-day cooldown for the NEXT mission (non-premium users after completing a mission)
  cooldownUntil: string | null; // ISO; if in the future, next mission is locked
  cooldownActive: boolean;
  // Premium missions are locked for non-premium users (can be viewed but not started)
  premiumLocked: boolean;
};

type MissionView = {
  template: MissionTemplate;
  state: MissionState;
};

function buildState(
  um: {
    id: string;
    currentStage: number;
    stageStartedAt: Date | null;
    completedAt: Date | null;
  } | null,
  template: MissionTemplate
): MissionState {
  if (!um) {
    return {
      userMissionId: null,
      started: false,
      currentStage: 0,
      stageStartedAt: null,
      stageReady: false,
      completedAt: null,
      pointsEarned: 0,
      cooldownUntil: null,
      cooldownActive: false,
      premiumLocked: false,
    };
  }
  if (um.completedAt) {
    return {
      userMissionId: um.id,
      started: true,
      currentStage: 3,
      stageStartedAt: um.stageStartedAt?.toISOString() ?? null,
      stageReady: true,
      completedAt: um.completedAt.toISOString(),
      pointsEarned: template.totalPoints,
      cooldownUntil: null,
      cooldownActive: false,
      premiumLocked: false,
    };
  }
  // in progress
  const stage = um.currentStage;
  const hours = stageHours(template, stage);
  const startedAt = um.stageStartedAt ? um.stageStartedAt.getTime() : 0;
  const deadline = startedAt + hours * 3600 * 1000;
  const ready = Date.now() >= deadline;
  // points earned = sum of completed stages (1..stage-1)
  let earned = 0;
  for (let s = 1; s < stage; s++) earned += stagePoints(template, s);
  return {
    userMissionId: um.id,
    started: true,
    currentStage: stage,
    stageStartedAt: um.stageStartedAt?.toISOString() ?? null,
    stageReady: ready,
    completedAt: null,
    pointsEarned: earned,
    cooldownUntil: null,
    cooldownActive: false,
    premiumLocked: false,
  };
}

export async function GET() {
  const user = await db.user.findFirst();
  if (!user) {
    return NextResponse.json({ error: "User not found" }, { status: 404 });
  }

  const userMissions = await db.userMission.findMany({
    where: { userId: user.id },
  });

  const completedTemplateIds = new Set(
    userMissions.filter((um) => um.completedAt).map((um) => um.templateId)
  );

  // For each category, find the most recently completed UserMission (to read its nextAvailableAt cooldown)
  function latestCompletedInCategory(cat: string) {
    const done = userMissions.filter(
      (um) => um.category === cat && um.completedAt && um.nextAvailableAt
    );
    if (done.length === 0) return null;
    return done.sort(
      (a, b) => b.completedAt!.getTime() - a.completedAt!.getTime()
    )[0];
  }

  // ===== 6 free missions: one per category, auto-advancing =====
  // The free template for a category is ALWAYS the first non-completed template
  // by sortOrder (NOT "any in-progress UserMission" — that would wrongly promote
  // a premium-started mission into the free slot).
  const free: MissionView[] = [];
  const freeTemplateIds = new Set<string>();

  for (const cat of CATEGORY_ORDER) {
    const catTemplates = MISSION_TEMPLATES.filter(
      (t) => t.category === cat
    ).sort((a, b) => a.sortOrder - b.sortOrder);

    // first non-completed template = the free slot
    const template = catTemplates.find((t) => !completedTemplateIds.has(t.id));

    if (!template) {
      // all missions in this category completed
      const allDone = catTemplates[0];
      if (!allDone) continue;
      free.push({
        template: allDone,
        state: {
          userMissionId: null,
          started: false,
          currentStage: 0,
          stageStartedAt: null,
          stageReady: false,
          completedAt: "all-done",
          pointsEarned: allDone.totalPoints,
          cooldownUntil: null,
          cooldownActive: false,
          premiumLocked: false,
        },
      });
      freeTemplateIds.add(allDone.id);
      continue;
    }

    freeTemplateIds.add(template.id);
    // the UserMission for THIS specific free template (if the user started it)
    const um =
      userMissions.find((u) => u.templateId === template.id && !u.completedAt) ??
      null;
    const state = buildState(um, template);

    // cooldown: if the latest completed mission in this category has nextAvailableAt in the future,
    // the next free template is locked until that time. Premium users bypass the cooldown entirely.
    if (!user.premium) {
      const latest = latestCompletedInCategory(cat);
      if (latest && latest.nextAvailableAt) {
        const until = latest.nextAvailableAt.getTime();
        if (until > Date.now()) {
          state.cooldownUntil = latest.nextAvailableAt.toISOString();
          state.cooldownActive = true;
        }
      }
    }

    free.push({ template, state });
  }

  // ===== Premium: all templates not in free-6 and not completed =====
  // For non-premium users these are shown but LOCKED (premiumLocked=true) unless
  // the user has already started one (an in-progress premium mission is allowed
  // to continue to completion).
  const premium: MissionView[] = MISSION_TEMPLATES.filter(
    (t) => !freeTemplateIds.has(t.id) && !completedTemplateIds.has(t.id)
  ).map((t) => {
    const um = userMissions.find((u) => u.templateId === t.id && !u.completedAt) ?? null;
    const state = buildState(um, t);
    // Lock premium missions for non-premium users (unless already started)
    if (!user.premium && !state.started) {
      state.premiumLocked = true;
    }
    return { template: t, state };
  });

  const completedCount = completedTemplateIds.size;

  return NextResponse.json({
    free,
    premium,
    premiumUser: user.premium,
    stats: {
      completed: completedCount,
      total: MISSION_TEMPLATES.length,
      inProgress: userMissions.filter((um) => !um.completedAt).length,
    },
  });
}

// ===== Actions: start mission / complete current stage / skip-12h =====
export async function POST(req: NextRequest) {
  const body = await req.json();
  const { action } = body as {
    action: "start" | "complete-stage" | "skip-12h";
    templateId?: string;
    userMissionId?: string;
  };

  const user = await db.user.findFirst();
  if (!user) {
    return NextResponse.json({ error: "User not found" }, { status: 404 });
  }

  if (action === "skip-12h") {
    // Subtract 12h from stageStartedAt of every in-progress mission stage,
    // so each stage deadline moves 12h closer (timer skips forward 12h).
    const inProgress = await db.userMission.findMany({
      where: { userId: user.id, completedAt: null, stageStartedAt: { not: null } },
    });
    const skipMs = 12 * 60 * 60 * 1000;
    let updated = 0;
    for (const um of inProgress) {
      if (!um.stageStartedAt) continue;
      const newStart = new Date(um.stageStartedAt.getTime() - skipMs);
      await db.userMission.update({
        where: { id: um.id },
        data: { stageStartedAt: newStart },
      });
      updated++;
    }
    return NextResponse.json({ skipped: true, affected: updated });
  }

  if (action === "start") {
    const template = getTemplate(body.templateId || "");
    if (!template) {
      return NextResponse.json({ error: "Template not found" }, { status: 404 });
    }
    // A premium mission (one not in the free-6) can only be started by premium users.
    // Determine if this template is a "free" template (the first non-completed in its category).
    const catTemplates = MISSION_TEMPLATES.filter(
      (t) => t.category === template.category
    ).sort((a, b) => a.sortOrder - b.sortOrder);
    const doneIds = new Set(
      (
        await db.userMission.findMany({
          where: { userId: user.id, completedAt: { not: null } },
          select: { templateId: true },
        })
      ).map((x) => x.templateId)
    );
    const freeTemplateForCategory = catTemplates.find((t) => !doneIds.has(t.id));
    const isPremiumMission = freeTemplateForCategory?.id !== template.id;

    if (isPremiumMission && !user.premium) {
      return NextResponse.json(
        { error: "Требуется премиум-подписка", premiumRequired: true },
        { status: 403 }
      );
    }
    // upsert: start stage 1
    const existing = await db.userMission.findUnique({
      where: { userId_templateId: { userId: user.id, templateId: template.id } },
    });
    if (existing && existing.completedAt) {
      return NextResponse.json({ error: "Already completed" }, { status: 400 });
    }
    const um = await db.userMission.upsert({
      where: { userId_templateId: { userId: user.id, templateId: template.id } },
      update: { currentStage: 1, stageStartedAt: new Date() },
      create: {
        userId: user.id,
        templateId: template.id,
        category: template.category,
        currentStage: 1,
        stageStartedAt: new Date(),
      },
    });
    return NextResponse.json({
      userMissionId: um.id,
      currentStage: um.currentStage,
      stageStartedAt: um.stageStartedAt?.toISOString() ?? null,
    });
  }

  if (action === "complete-stage") {
    const um = await db.userMission.findUnique({
      where: { id: body.userMissionId },
    });
    if (!um || um.userId !== user.id) {
      return NextResponse.json({ error: "Mission not found" }, { status: 404 });
    }
    if (um.completedAt) {
      return NextResponse.json({ error: "Already completed" }, { status: 400 });
    }
    const template = getTemplate(um.templateId);
    if (!template) {
      return NextResponse.json({ error: "Template missing" }, { status: 500 });
    }

    // check timer elapsed for current stage
    const hours = stageHours(template, um.currentStage);
    const startedAt = um.stageStartedAt ? um.stageStartedAt.getTime() : 0;
    const deadline = startedAt + hours * 3600 * 1000;
    if (Date.now() < deadline) {
      return NextResponse.json(
        { error: "Этап ещё выполняется", deadline },
        { status: 400 }
      );
    }

    // award points for the completed stage to the category skill
    const pts = stagePoints(template, um.currentStage);
    await db.attribute.updateMany({
      where: { userId: user.id, key: um.category },
      data: { points: { increment: pts } },
    });

    if (um.currentStage >= 3) {
      // mission fully complete
      // nextAvailableAt: premium → instant (now), non-premium → now + 7 days
      const now = new Date();
      const nextAvailableAt = user.premium
        ? now
        : new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);
      const completed = await db.userMission.update({
        where: { id: um.id },
        data: { completedAt: now, nextAvailableAt },
      });
      // determine next free template for this category
      const allCat = MISSION_TEMPLATES.filter(
        (t) => t.category === (um.category as CategoryKey)
      ).sort((a, b) => a.sortOrder - b.sortOrder);
      const doneIds = new Set(
        (
          await db.userMission.findMany({
            where: { userId: user.id, completedAt: { not: null } },
            select: { templateId: true },
          })
        ).map((x) => x.templateId)
      );
      const next = allCat.find((t) => !doneIds.has(t.id)) ?? null;
      return NextResponse.json({
        completed: true,
        pointsAwarded: pts,
        skillKey: um.category,
        nextTemplateId: next?.id ?? null,
        completedAt: completed.completedAt?.toISOString(),
        nextAvailableAt: nextAvailableAt.toISOString(),
        premium: user.premium,
      });
    } else {
      // advance to next stage, start its timer
      const updated = await db.userMission.update({
        where: { id: um.id },
        data: {
          currentStage: um.currentStage + 1,
          stageStartedAt: new Date(),
        },
      });
      return NextResponse.json({
        completed: false,
        pointsAwarded: pts,
        skillKey: um.category,
        currentStage: updated.currentStage,
        stageStartedAt: updated.stageStartedAt?.toISOString() ?? null,
      });
    }
  }

  return NextResponse.json({ error: "Unknown action" }, { status: 400 });
}
