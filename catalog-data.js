/* Single catalog for every published exhibit. */
const EARTH_CATALOG = {
  "levels": {
    "basic": {
      "name": "基本的知識",
      "range": "中学生まで",
      "description": "小中学校で学ぶ主題と、割合・速さ・面積・体積を足がかりに見る展示。"
    },
    "advanced": {
      "name": "発展的知識",
      "range": "高校以上",
      "description": "高校の理科・数学や、専門的な定義・観測・研究上の推定へ踏み込む展示。"
    }
  },
  "genres": {
    "space": "宇宙・天体",
    "air": "大気・気象",
    "water": "海洋・水循環",
    "geology": "地形・地球内部",
    "matter": "元素・物質",
    "physics": "物理・エネルギー",
    "life": "生命・生態系",
    "environment": "環境・人間活動"
  },
  "exhibits": [
    {
      "id": "distance",
      "number": 1,
      "level": "basic",
      "genre": "space",
      "title": "地球と惑星の距離",
      "description": "惑星を選び、位置によって変わる地球との距離を比べる。",
      "concepts": "太陽系・距離・比例",
      "href": "index.html#distance"
    },
    {
      "id": "motion",
      "number": 2,
      "level": "advanced",
      "genre": "space",
      "title": "宇宙を進む速さ",
      "description": "自転・公転・銀河の公転を、それぞれの基準で比較する。",
      "concepts": "基準系・相対速度",
      "href": "index.html#motion"
    },
    {
      "id": "atmosphere",
      "number": 3,
      "level": "advanced",
      "genre": "air",
      "title": "大気の薄さ",
      "description": "成層圏までの高度を地球の直径と比べ、模型へ換算する。",
      "concepts": "大気の鉛直構造",
      "href": "index.html#atmosphere"
    },
    {
      "id": "inside",
      "number": 4,
      "level": "advanced",
      "genre": "geology",
      "title": "地球の内側",
      "description": "地殻・マントル・核の断面と、地表の凹凸を同じ縮尺で見る。",
      "concepts": "地球内部の層構造",
      "href": "index.html#inside"
    },
    {
      "id": "elements",
      "number": 5,
      "level": "advanced",
      "genre": "matter",
      "title": "地球をつくる元素",
      "description": "核まで含む全地球の元素組成を、推定質量比で比べる。",
      "concepts": "全地球組成の推定",
      "href": "index.html#elements"
    },
    {
      "id": "time",
      "number": 6,
      "level": "basic",
      "genre": "geology",
      "title": "45.4億年の時計",
      "description": "地球の歴史を24時間に置き換え、生命と人類の時間を比べる。",
      "concepts": "地球史・時間の比例",
      "href": "index.html#time"
    },
    {
      "id": "water",
      "number": 7,
      "level": "basic",
      "genre": "water",
      "title": "すべての水を一滴に",
      "description": "全水量・淡水・湖と川の水を、それぞれ球にして比べる。",
      "concepts": "水の分布・体積比",
      "href": "index.html#water"
    },
    {
      "id": "cycles",
      "number": 8,
      "level": "advanced",
      "genre": "environment",
      "title": "森林と炭素の循環",
      "description": "森林面積の純減と、陸・海のCO₂吸収量を定義とともに読む。",
      "concepts": "炭素収支・推定の不確かさ",
      "href": "index.html#cycles"
    },
    {
      "id": "light",
      "number": 9,
      "level": "basic",
      "genre": "physics",
      "title": "光の速さで旅する",
      "description": "地球・月・太陽への光の所要時間を比べる。",
      "concepts": "光・速さと時間",
      "href": "index.html#light"
    },
    {
      "id": "stars",
      "number": 10,
      "level": "advanced",
      "genre": "space",
      "title": "宇宙の星と砂粒",
      "description": "星の数の推定レンジと、桁の大きさを体感する。",
      "concepts": "宇宙規模の外挿推定",
      "href": "index.html#stars"
    },
    {
      "id": "solar",
      "number": 11,
      "level": "advanced",
      "genre": "physics",
      "title": "太陽のエネルギー",
      "description": "太陽放射と地球の断面積から、届くエネルギーを計算する。",
      "concepts": "放射・電力とエネルギー",
      "href": "index.html#solar"
    },
    {
      "id": "lightning",
      "number": 12,
      "level": "basic",
      "genre": "air",
      "title": "世界の雷の数",
      "description": "平均の発光回数を経過時間に換算する。",
      "concepts": "電気・平均と時間",
      "href": "index.html#lightning"
    },
    {
      "id": "quake",
      "number": 13,
      "level": "advanced",
      "genre": "geology",
      "title": "地震エネルギー",
      "description": "マグニチュード差とエネルギー比の関係を円の面積で見る。",
      "concepts": "指数・対数的な尺度",
      "href": "index.html#quake"
    },
    {
      "id": "airmass",
      "number": 14,
      "level": "basic",
      "genre": "air",
      "title": "空気の総質量",
      "description": "大気の質量をkgとトンで切り替える。",
      "concepts": "大気圧・質量・単位換算",
      "href": "index.html#airmass"
    },
    {
      "id": "dna",
      "number": 15,
      "level": "advanced",
      "genre": "life",
      "title": "DNAをつなぐ距離",
      "description": "DNA量と核のある細胞数の仮定から、長さを計算する。",
      "concepts": "核DNA・細胞数モデル",
      "href": "index.html#dna"
    },
    {
      "id": "mammals",
      "number": 16,
      "level": "advanced",
      "genre": "life",
      "title": "哺乳類のバイオマス",
      "description": "人間・家畜・野生を、炭素質量という共通基準で比べる。",
      "concepts": "バイオマス・炭素質量",
      "href": "index.html#mammals"
    },
    {
      "id": "species",
      "number": 17,
      "level": "basic",
      "genre": "life",
      "title": "名前のない生物",
      "description": "生物の分類と、記載済み・未記載の推定割合を比べる。",
      "concepts": "生物の分類・割合",
      "href": "index.html#species"
    },
    {
      "id": "humanmass",
      "number": 18,
      "level": "advanced",
      "genre": "environment",
      "title": "人工物と生命の重さ",
      "description": "乾燥質量で比べた人工物と生物量の推定を読む。",
      "concepts": "質量基準・全球推計",
      "href": "index.html#humanmass"
    },
    {
      "id": "plastic",
      "number": 19,
      "level": "basic",
      "genre": "environment",
      "title": "プラスチックの長さ",
      "description": "質量・密度・太さから仮想の紐の長さを計算する。",
      "concepts": "密度・体積・円の面積",
      "href": "index.html#plastic"
    },
    {
      "id": "cloud",
      "number": 20,
      "level": "basic",
      "genre": "air",
      "title": "雲の水滴の重さ",
      "description": "雲の体積と水滴の密度を変え、含まれる水の重さを考える。",
      "concepts": "雲・密度・体積",
      "href": "index.html#cloud"
    },
    {
      "id": "dust",
      "number": 21,
      "level": "basic",
      "genre": "space",
      "title": "宇宙からの塵",
      "description": "一日あたりの概数から、宇宙塵の量を時間で換算する。",
      "concepts": "流星・質量と時間",
      "href": "index.html#dust"
    },
    {
      "id": "rotation",
      "number": 22,
      "level": "advanced",
      "genre": "space",
      "title": "一日の長さの変化",
      "description": "自転の長期変化を、観測史と一定速度の仮定で比較する。",
      "concepts": "潮汐・地球の自転変動",
      "href": "index.html#rotation"
    },
    {
      "id": "seafloor",
      "number": 23,
      "level": "basic",
      "genre": "water",
      "title": "海底の未測量領域",
      "description": "測量済みの面積割合を、直接探査と区別して見る。",
      "concepts": "海底地形・面積の割合",
      "href": "index.html#seafloor"
    },
    {
      "id": "gold",
      "number": 24,
      "level": "advanced",
      "genre": "matter",
      "title": "海水中の金",
      "description": "海水中に含まれる金の、極微量な濃度を比較する。",
      "concepts": "微量元素・濃度の桁",
      "href": "index.html#gold"
    },
    {
      "id": "ridge",
      "number": 25,
      "level": "basic",
      "genre": "geology",
      "title": "海底の山脈",
      "description": "中央海嶺の全長を地球一周の長さと比較する。",
      "concepts": "海底地形・プレート",
      "href": "index.html#ridge"
    },
    {
      "id": "plates",
      "number": 26,
      "level": "basic",
      "genre": "geology",
      "title": "プレートの動く速さ",
      "description": "年あたり数cmの動きを、時間と距離へ置き換える。",
      "concepts": "プレート・速さと時間",
      "href": "index.html#plates"
    },
    {
      "id": "coreheat",
      "number": 27,
      "level": "advanced",
      "genre": "geology",
      "title": "地球内部の温度",
      "description": "内核境界の鉄の融解実験による推定温度を読む。",
      "concepts": "高圧の鉄・融解・外挿",
      "href": "index.html#coreheat"
    },
    {
      "id": "fungus",
      "number": 28,
      "level": "basic",
      "genre": "life",
      "title": "巨大な菌類個体",
      "description": "地下の菌糸が広がる面積を、身近な面積で比べる。",
      "concepts": "菌類・個体・面積",
      "href": "index.html#fungus"
    },
    {
      "id": "ants",
      "number": 29,
      "level": "basic",
      "genre": "life",
      "title": "地球のアリの数",
      "description": "個体数の推定を、仮定した人口一人あたりに換算する。",
      "concepts": "個体数・比・大きな数",
      "href": "index.html#ants"
    },
    {
      "id": "bacteria",
      "number": 30,
      "level": "advanced",
      "genre": "life",
      "title": "体内の細菌の数",
      "description": "基準成人モデルの細菌数とヒト細胞数を比べる。",
      "concepts": "細胞数の推定モデル",
      "href": "index.html#bacteria"
    },
    {
      "id": "minerals",
      "number": 31,
      "level": "advanced",
      "genre": "matter",
      "title": "鉄と地球のミネラル",
      "description": "元素ごとの質量比と、地球全体での推定質量を見る。",
      "concepts": "地球化学・元素と鉱物",
      "href": "index.html#minerals"
    },
    {
      "id": "moon-recession",
      "number": 32,
      "level": "advanced",
      "genre": "space",
      "title": "月が遠ざかる距離",
      "description": "現在の代表的な後退速度を一定として、距離の増加を比較する。",
      "concepts": "潮汐・月レーザー測距",
      "href": "discoveries.html#moon-recession"
    },
    {
      "id": "rain-volume",
      "number": 33,
      "level": "basic",
      "genre": "water",
      "title": "雨1 mmの水量",
      "description": "雨量と面積を動かし、水の体積と質量を計算する。",
      "concepts": "降水量・面積・体積",
      "href": "discoveries.html#rain-volume"
    },
    {
      "id": "ocean-pressure",
      "number": 34,
      "level": "basic",
      "genre": "water",
      "title": "深さで変わる水圧",
      "description": "深さと水圧の関係を見て、絶対圧と水による増加分を比べる。",
      "concepts": "水圧・圧力。計算式は高校の発展内容",
      "href": "discoveries.html#ocean-pressure"
    }
  ]
};
