/** 2026-10-31 확인. 계산기와 가이드에서 같은 공식 근거를 연결한다. */
export type OfficialSource = { label: string; href: string }

const isa = {
  label: '국가법령정보센터 · 조세특례제한법 제91조의18 (ISA)',
  href: 'https://www.law.go.kr/lsLinkCommonInfo.do?lsJoLnkSeq=1024359131',
}
const pensionTax = {
  label: '국세청 · 연금계좌 세액공제',
  href: 'https://nts.go.kr/nts/cm/cntnts/cntntsView.do?cntntsId=7875&mi=6439',
}
const depositProtection = {
  label: '금융위원회 · 예금보호한도와 보호상품 안내',
  href: 'https://www.fsc.go.kr/no040000?cnId=2817&curPage=1',
}

export const officialSources: Record<string, readonly OfficialSource[]> = {
  '/salary': [
    { label: '국가법령정보센터 · 2026.2.27 개정 근로소득 간이세액표 (PDF)', href: 'https://www.law.go.kr/LSW/flDownload.do?bylClsCd=110201&flSeq=161861245&gubun=' },
    { label: '국민연금공단 · 보험료율·기준소득월액 상하한', href: 'https://www.nps.or.kr/pnsinfo/ntpsklg/getOHAF0038M0.do?menuId=MN24001113' },
    { label: '보건복지부 · 2026년 건강보험료율', href: 'https://www.mohw.go.kr/board.es?mid=a10503010100&bid=0027&act=view&list_no=1487279&tag=&nPage=1' },
    { label: '보건복지부 · 2026년 장기요양보험료율', href: 'https://www.mohw.go.kr/board.es?mid=a10503010100&bid=0027&act=view&list_no=1487817&tag&nPage=1' },
    { label: '고용노동부 · 2026년 적용 최저임금', href: 'https://www.moel.go.kr/news/enews/report/enewsView.do?news_seq=18144&pageUnit=10' },
    pensionTax,
  ],
  '/mortgage': [
    { label: '금융위원회 · 3단계 스트레스 DSR 시행방안', href: 'https://www.fsc.go.kr/no010101/84617' },
    { label: '금융위원회 · 2026년 하반기 스트레스 DSR 행정지도', href: 'https://better.fsc.go.kr/fsc_new/status/adminMap/OpertnDetail.do?muNo=145&postNo=4215&stNo=11' },
  ],
  '/severance': [
    { label: '고용노동부 · 퇴직금 계산기와 평균임금 산정 예시', href: 'https://1350.moel.go.kr/home/hp/retirementpaycal/retirementpaycal.jsp' },
    { label: '고용노동부 · 연차수당의 평균임금 포함 여부', href: 'https://1350.moel.go.kr/rtmview.do?id=1000277905' },
    { label: '고용노동부 · 퇴직금 지급기한', href: 'https://www.moel.go.kr/faq/faqView.do?seqRepeat=118' },
    { label: '국세청 · 연금소득 원천징수', href: 'https://www.nts.go.kr/nts/cm/cntnts/cntntsView.do?cntntsId=7888&mi=2312' },
  ],
  '/savings': [isa, pensionTax, depositProtection],
  '/jeonse': [
    { label: '국가법령정보센터 · 주택임대차보호법', href: 'https://www.law.go.kr/LSW/lsInfoP.do?lsId=001248' },
    { label: 'HUG · 전세보증금반환보증 상품·신청 조건', href: 'https://www.khug.or.kr/hug/web/ig/dr/igdr000001.jsp?tabMenu=Y' },
    { label: '한국은행 · 통화정책 결정 자료와 기준금리', href: 'https://www.bok.or.kr/portal/main/contents.do?menuNo=200755' },
  ],
  '/lotto': [
    { label: '동행복권 · 당첨금 지급처·준비물·지급기한', href: 'https://m.dhlottery.co.kr/guide/wnrGuide' },
    { label: '국가법령정보센터 · 소득세법', href: 'https://www.law.go.kr/LSW/lsInfoP.do?ancYnChk=0&chrClsCd=010202&efYd=20260421&joNo=009702&lsiSeq=285523&urlMode=lsInfoP' },
    depositProtection,
  ],
}
