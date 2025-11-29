import { ScenarioType } from '../utils/saudiId';

export async function nafathVerifyMock(id: string): Promise<{ ok: boolean }>{
  // simulate 3-4 seconds for Nafath verification
  await new Promise((res) => setTimeout(res, 3000));
  // always ok for demo
  return { ok: true };
}

export async function checkTravelRecordMock(id: string): Promise<{ outside: boolean }>{
  // simple mock: ids ending with 0-4 are outside
  const last = Number(id[id.length - 1]);
  return { outside: last <= 4 };
}

export async function matchRelativeMock(id: string, fullName: string): Promise<{ matched: boolean; relation?: string }>{
  await new Promise((res) => setTimeout(res, 1200));
  // naive mock: match when name length > 6
  const matched = fullName.trim().length > 6;
  return { matched, relation: matched ? 'الدرجة الأولى' : undefined };
}

export async function sendContactRequestMock(id: string, fullName: string): Promise<{ accepted: boolean }>{
  await new Promise((res) => setTimeout(res, 2000));
  // 60% acceptance rate
  const accepted = Math.random() < 0.6;
  return { accepted };
}

export async function openSecureChannelMock(id: string, toName: string): Promise<{ channelId: string }>{
  await new Promise((res) => setTimeout(res, 800));
  return { channelId: `chan_${Date.now()}` };
}
