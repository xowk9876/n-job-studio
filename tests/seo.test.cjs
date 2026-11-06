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
