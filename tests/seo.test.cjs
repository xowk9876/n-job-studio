/* eslint-disable @typescript-eslint/no-require-imports */
const assert = require('node:assert/strict')
const { test } = require('node:test')
const { createElement } = require('react')
const { renderToStaticMarkup } = require('react-dom/server')
const { SITE_URL, buildGuideMetadata, guideItems } = require('../lib/seo')

test('계산기마다 첫 HTML에 해당 계산기와 탐색 경로가 한 번씩 들어간다', () => {
  for (const { calculatorPath } of guideItems) {
    const { default: Layout, metadata } = require(`../app${calculatorPath}/layout`)
    const html = renderToStaticMarkup(createElement(Layout, null))
    const scripts = [...html.matchAll(/<script\b[^>]*\btype="application\/ld\+json"[^>]*>([\s\S]*?)<\/script>/g)]
    assert.equal(scripts.length, 1, calculatorPath)
    const graph = JSON.parse(scripts[0][1])['@graph']
    const applications = graph.filter((node) => node['@type'] === 'WebApplication')
    const breadcrumbs = graph.filter((node) => node['@type'] === 'BreadcrumbList')
    const url = SITE_URL + calculatorPath

    assert.equal(applications.length, 1, calculatorPath)
    assert.equal(applications[0].url, url)
    assert.equal(applications[0].description, metadata.description)
    assert.equal(breadcrumbs.length, 1)
    assert.equal(breadcrumbs[0].itemListElement.at(-1).item, url)
    assert.equal(metadata.alternates.canonical, url)
    assert.equal(metadata.other?.description, undefined)
  }
})

test('가이드의 검색 설명과 대표 주소가 공유 정보와 일치한다', () => {
  for (const guide of guideItems) {
    const metadata = buildGuideMetadata(guide)
    assert.equal(metadata.description, guide.description)
    assert.equal(metadata.other?.description, undefined)
    assert.equal(metadata.openGraph.description, metadata.description)
    assert.equal(metadata.twitter.description, metadata.description)
    assert.equal(metadata.alternates.canonical, SITE_URL + '/guide/' + guide.slug)
  }
})

test('주담대 비교표는 첫 HTML에 같은 조건의 세 상환 방식을 보여준다', () => {
  const { MortgageExamples } = require('../components/ui/CalculatorExamples')
  const html = renderToStaticMarkup(createElement(MortgageExamples))
  assert.match(html, /대출금 3억원 · 연 4% 고정 가정 · 360개월/)
  const rows = [...html.matchAll(/<tr>([\s\S]*?)<\/tr>/g)].slice(1).map(match => match[1].replace(/<[^>]*>/g, ' ').trim())
  assert.equal(rows.length, 3)
  assert.match(html, /단위: 원/)
  assert.match(rows[0], /원리금균등\s+1,432,246\s+215,608,483/)
  assert.match(rows[1], /원금균등\s+1,833,333\s+180,500,071/)
  assert.match(rows[2], /만기일시\s+1,000,000\s+360,000,000/)
  assert.match(html, /마지막 달에는 원금 3억원도 함께 갚습니다/)
})

test('전월세 예시는 남기는 보증금과 전환하는 차액을 구분한다', () => {
  const { JeonseExamples } = require('../components/ui/CalculatorExamples')
  const html = renderToStaticMarkup(createElement(JeonseExamples))
  assert.match(html, /보증금 5,000만원·월세 90만원/)
  assert.match(html, /전세 환산액 266,000,000원/)
  assert.match(html, /남겨 두는 보증금이 아니라 줄어드는 보증금의 차액/)
  assert.match(html, /41,667원/)
  assert.match(html, /125,000원/)
  assert.match(html, /208,333원/)
  assert.match(html, /법정 보증금이나 시세를 뜻하지 않습니다/)
})

test('변경한 계산기의 날짜만 사이트맵과 구조화 데이터에 함께 반영한다', () => {
  const { default: sitemap } = require('../app/sitemap')
  const { buildWebApplicationJsonLd, CONTENT_UPDATED_AT, COPY_UPDATED_AT, SALARY_GUIDE_UPDATED_AT } = require('../lib/seo')
  for (const path of ['/mortgage', '/jeonse', '/salary', '/savings', '/severance', '/lotto']) {
    assert.equal(sitemap().find(item => item.url === SITE_URL + path).lastModified, COPY_UPDATED_AT)
    assert.equal(buildWebApplicationJsonLd({ path, name: path, description: path }).dateModified, COPY_UPDATED_AT)
  }
  assert.equal(sitemap().find(item => item.url === SITE_URL + '/guide/dsr-stress-test-2026').lastModified, COPY_UPDATED_AT)
  assert.equal(sitemap().find(item => item.url === SITE_URL + '/guide/2026-salary-tax-guide').lastModified, SALARY_GUIDE_UPDATED_AT)
  assert.equal(sitemap().find(item => item.url === SITE_URL + '/privacy-policy').lastModified, CONTENT_UPDATED_AT)
})
