import { ProductCategory } from "@/types/product";

const RULES: { keywords: string[]; category: ProductCategory }[] = [
  {
    keywords: ["아이폰", "iphone", "갤럭시 s", "맥북", "macbook", "그램", "아이패드", "ipad",
      "갤럭시 탭", "galaxy tab", "에어팟", "airpod", "소니 wh", "닌텐도", "스위치",
      "카메라", "미러리스", "무선 충전", "마우스패드", "보조배터리", "무선 마우스",
      "노트북 파우치", "usb 허브", "usb 메모리", "멀티충전", "스마트폰 거치대"],
    category: "전자기기",
  },
  {
    keywords: ["나이키", "아디다스", "뉴발란스", "패딩", "코트", "플리스", "티셔츠", "셔츠",
      "폴로", "후드", "조거", "재킷", "구찌", "선글라스", "볼캡", "모자", "양말",
      "슬리퍼", "지갑", "명함지갑", "에코백", "토트백", "숄더백", "스니커즈", "운동화"],
    category: "패션/의류",
  },
  {
    keywords: ["청소기", "공기청정기", "밥솥", "토스터", "선풍기", "세탁기", "냉장고", "에어컨"],
    category: "가전",
  },
  {
    keywords: ["서랍장", "매트리스", "조명", "테이블", "의자", "소파", "침대", "책상", "선반"],
    category: "가구/인테리어",
  },
  {
    keywords: ["자전거", "바이크", "배드민턴", "라켓", "요가", "매트", "마라톤", "탄력밴드", "운동 밴드", "골프", "등산"],
    category: "스포츠/레저",
  },
  {
    keywords: ["기생충", "해리포터", "색소폰", "우쿨렐레", "레고", "악기", "책", "도서", "만화", "퍼즐"],
    category: "도서/취미",
  },
  {
    keywords: ["에어랩", "크림", "에센스", "sk-ii", "핸드크림", "폼클렌저", "화장품", "립", "파운데이션", "향수"],
    category: "뷰티",
  },
  {
    keywords: ["르크루제", "주전자", "에스프레소", "커피", "칼 세트", "냄비", "프라이팬", "보냉"],
    category: "주방/생활",
  },
  {
    keywords: ["범보", "킥보드", "듀플로", "유아", "아기", "장난감", "유모차"],
    category: "유아동",
  },
  {
    keywords: ["강아지", "고양이", "캣타워", "사료", "펫", "반려"],
    category: "반려동물",
  },
  {
    keywords: ["삼성sds", "sds", "it캠프"],
    category: "기업굿즈",
  },
];

export function detectCategory(title: string): ProductCategory {
  const lower = title.toLowerCase();
  for (const { keywords, category } of RULES) {
    if (keywords.some((kw) => lower.includes(kw.toLowerCase()))) {
      return category;
    }
  }
  return "기타";
}
