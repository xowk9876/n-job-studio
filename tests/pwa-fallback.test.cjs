/* eslint-disable @typescript-eslint/no-require-imports */
const { test } = require('node:test')
const assert = require('node:assert/strict')
const React = require('react')
const { renderToStaticMarkup } = require('react-dom/server')
const { getInstallContext } = require('../lib/pwa-install.ts')
const { SITE_URL } = require('../lib/seo-platform.ts')
const HomeAppShortcut = require('../components/home/HomeAppShortcut.tsx').default

for (const [ua, platform, touch, device, inApp] of [
  ['Mozilla/5.0 (Linux; Android 15) Chrome/130 NAVER(inapp; search)', 'Linux', 5, 'android', true],
  ['Mozilla/5.0 (Linux; Android 15; wv) Instagram 350', 'Linux', 5, 'android', true],
  ['Mozilla/5.0 (iPhone) AppleWebKit/605.1.15 Instagram', 'iPhone', 5, 'ios', true],
  ['Mozilla/5.0 (Macintosh) Version/18 Safari/605.1.15', 'MacIntel', 5, 'ios', false],
  ['Mozilla/5.0 (Linux; Android 15) Chrome/130 Safari/537.36', 'Linux', 5, 'android', false],
  ['Mozilla/5.0 (Windows NT 10.0) Chrome/130', 'Win32', 0, 'desktop', false],
]) {
  test(`install guidance context: ${device}, embedded=${inApp}, ${ua}`, () => {
    assert.deepEqual(getInstallContext(ua, platform, touch), { device, inApp })
  })
}

// Exercise event handlers with a small hook harness using the existing React dependency.
// Browser layout and native installation still need device/browser verification.
function harness(t, ua = 'Mozilla/5.0 (Linux; Android 15) NAVER') {
  const slots = [], effects = [], listeners = new Map()
  let cursor = 0, tree
  t.mock.method(React, 'useState', initial => {
    const i = cursor++
    if (!(i in slots)) slots[i] = initial
    return [slots[i], value => { slots[i] = typeof value === 'function' ? value(slots[i]) : value }]
  })
  t.mock.method(React, 'useRef', initial => {
    const i = cursor++
    if (!(i in slots)) slots[i] = { current: initial }
    return slots[i]
  })
  t.mock.method(React, 'useEffect', callback => { if (!tree) effects.push(callback) })
  const oldWindow = global.window, oldNavigator = Object.getOwnPropertyDescriptor(global, 'navigator')
  global.window = { matchMedia: () => ({ matches: false, addEventListener() {}, removeEventListener() {} }), addEventListener: (key, fn) => listeners.set(key, fn), removeEventListener() {} }
  Object.defineProperty(global, 'navigator', { configurable: true, value: { userAgent: ua, platform: '', maxTouchPoints: 5, clipboard: { writeText: async value => { api.copied = value } } } })
  t.after(() => { global.window = oldWindow; Object.defineProperty(global, 'navigator', oldNavigator) })
  const nodes = (node, out = []) => {
    if (!node || typeof node !== 'object') return out
    if (Array.isArray(node)) { node.forEach(child => nodes(child, out)); return out }
    out.push(node); nodes(node.props?.children, out); return out
  }
  const api = {
    render() { cursor = 0; tree = HomeAppShortcut(); return tree },
    html() { return renderToStaticMarkup(api.render()) },
    async click(label, event) {
      const button = nodes(api.render()).find(node => node.type === 'button' && node.props.children === label)
      assert.ok(button, `button exists: ${label}`)
      button.props.onClick(event)
      await new Promise(resolve => setImmediate(resolve))
    },
    dispatch(name, event) { listeners.get(name)?.(event) },
    copied: null,
  }
  api.render(); effects.forEach(callback => callback())
  return api
}

test('no install event opens inline Android guide and copies canonical URL, not a preview URL', async t => {
  const ui = harness(t)
  await ui.click('Android 홈 화면에 추가')
  const html = ui.html()
  assert.ok(html.includes('현재 앱 안의 브라우저'))
  assert.ok(html.indexOf('id="install-guide-android"') < html.indexOf('iPhone 홈 화면 추가 안내'))
  assert.ok(html.includes('메뉴가 없거나 계속 앱 안에서 열린다면'))
  await ui.click('사이트 주소 복사')
  assert.equal(ui.copied, SITE_URL)
  assert.ok(ui.html().includes('Chrome 주소창'))
})

test('iOS fallback and blocked clipboard leave a selectable address', async t => {
  const ui = harness(t, 'Mozilla/5.0 (iPhone) Instagram')
  await ui.click('iPhone 홈 화면 추가 안내')
  navigator.clipboard.writeText = async () => { throw new Error('permission denied') }
  await ui.click('사이트 주소 복사')
  assert.ok(ui.html().includes('직접 복사해주세요'))
  assert.ok(ui.html().includes(`value="${SITE_URL}"`))
  navigator.clipboard.writeText = async () => {}
  await ui.click('사이트 주소 복사')
  assert.ok(ui.html().includes('Safari 주소창'))
})

test('native event is preferred even with an embedded UA, consumed once and a later event can retry', async t => {
  const ui = harness(t)
  let prompts = 0, prevented = 0
  const event = () => ({ preventDefault() { prevented++ }, async prompt() { prompts++ }, userChoice: Promise.resolve({ outcome: 'dismissed' }) })
  ui.dispatch('beforeinstallprompt', event())
  await ui.click('Android 홈 화면에 추가')
  assert.equal(prompts, 1)
  assert.ok(ui.html().includes('설치를 취소했습니다'))
  await ui.click('Android 홈 화면에 추가')
  assert.equal(prompts, 1)
  ui.dispatch('beforeinstallprompt', event())
  await ui.click('Android 홈 화면에 추가')
  assert.equal(prompts, 2)
  assert.equal(prevented, 2)
})

test('closing and switching guides clear stale status and restore trigger focus', async t => {
  const ui = harness(t)
  await ui.click('Android 홈 화면에 추가')
  await ui.click('사이트 주소 복사')
  await ui.click('iPhone 홈 화면 추가 안내')
  assert.ok(!ui.html().includes('주소를 복사했습니다'))
  let focused = false
  await ui.click('안내 닫기', { currentTarget: { closest: () => ({ querySelector: () => ({ focus() { focused = true } }) }) } })
  assert.ok(focused)
  assert.ok(!ui.html().includes('role="region"'))
})
