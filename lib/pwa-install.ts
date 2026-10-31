export type InstallPrompt = Event & {
  prompt: () => Promise<void>
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>
}

/** 호출자는 이벤트를 먼저 소비해야 한다. 실패·취소 후에도 같은 이벤트를 재사용하지 않는다. */
export async function installFromPrompt(event: InstallPrompt): Promise<'accepted' | 'dismissed' | 'failed'> {
  try {
    await event.prompt()
    return (await event.userChoice).outcome
  } catch {
    return 'failed'
  }
}
