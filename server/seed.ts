import pool from './db';
import type { SeedTask } from './types';

const tasks: SeedTask[] = [
  // 一、核心前置准备
  { phase: '一、核心前置准备', phase_order: 1, title: '准备3~5个公司名称候选', description: '格式：行政区划+字号+行业特点+组织形式，如"苏州工业园区某某科技有限公司"。多准备几个避免核名失败', sort_order: 1 },
  { phase: '一、核心前置准备', phase_order: 1, title: '确定注册资本金额', description: '根据新《公司法》，认缴期最长5年，无需一次性实缴。根据实际需求合理设定金额', sort_order: 2 },
  { phase: '一、核心前置准备', phase_order: 1, title: '制定出资计划', description: '规划5年内的出资节奏，确保在期限内缴足注册资本', sort_order: 3 },
  { phase: '一、核心前置准备', phase_order: 1, title: '确定公司组织架构', description: '一人公司精简架构：股东1人（自己）、法定代表人（董事或经理兼任）、可不设监事（2024新规）', sort_order: 4 },
  { phase: '一、核心前置准备', phase_order: 1, title: '准备注册地址材料', description: '园区推行"住所登记申报承诺制"。如房屋产权可在线核验，只需在线签署承诺书，无需房产证复印件或租赁合同', sort_order: 5 },
  { phase: '一、核心前置准备', phase_order: 1, title: '确定经营范围', description: '通过系统标准化表述库勾选，如：软件开发、数字内容制作服务、人工智能应用开发等', sort_order: 6 },
  { phase: '一、核心前置准备', phase_order: 1, title: '准备相关人员身份证件', description: '上传股东身份证件，设置董事/经理、财务负责人、联络员等角色信息', sort_order: 7 },

  // 二、全链通线上注册
  { phase: '二、全链通线上注册', phase_order: 2, title: '访问江苏政务服务网', description: '定位切换至"苏州市-苏州工业园区"，进入"企业全链通服务专题"，点击"我要开办"', sort_order: 1 },
  { phase: '二、全链通线上注册', phase_order: 2, title: '完成名称自主申报', description: '填入预备的公司名称进行系统自动筛查与自主申报，确认名称可用', sort_order: 2 },
  { phase: '二、全链通线上注册', phase_order: 2, title: '一窗填报设立信息', description: '录入股东及人员信息、确定经营范围、上传/生成公司章程。可勾选"全选"一网通办', sort_order: 3 },
  { phase: '二、全链通线上注册', phase_order: 2, title: '确认自动生成的公司章程', description: '系统根据填报信息自动生成标准章程，一人公司章程由唯一股东直接制定并签署', sort_order: 4 },
  { phase: '二、全链通线上注册', phase_order: 2, title: '所有人员完成实名认证', description: '下载"苏服办"APP或通过微信/支付宝"登记注册身份验证"小程序进行实名认证', sort_order: 5 },
  { phase: '二、全链通线上注册', phase_order: 2, title: '完成电子签名', description: '材料在线生成后，使用"企业通"或"苏服办"APP扫码进行线上电子签名', sort_order: 6 },
  { phase: '二、全链通线上注册', phase_order: 2, title: '等待审批通过', description: '园区行政审批局形式审查，通常0.5天到2个工作日内获批', sort_order: 7 },
  { phase: '二、全链通线上注册', phase_order: 2, title: '领取营业执照大礼包', description: '前往星塘大厦（园区市民服务中心）二楼窗口领取：营业执照正副本、免费全套印章（公章、法人章、财务章、发票章）。也可通过自助政务机或邮寄方式领取', sort_order: 8 },

  // 三、同步联办事项
  { phase: '三、同步联办事项', phase_order: 3, title: '确认公章刻制', description: '园区对新开办企业免收首套印章刻制费，线上选定刻制单位后随执照一同发放', sort_order: 1 },
  { phase: '三、同步联办事项', phase_order: 3, title: '预约银行开户', description: '在全链通系统内勾选合作银行网点（建行、工行、招行等）预开户，之后带执照和公章去网点一次办妥', sort_order: 2 },
  { phase: '三、同步联办事项', phase_order: 3, title: '完成银行开户', description: '携带营业执照和公章前往预约的银行网点完成开户手续', sort_order: 3 },
  { phase: '三、同步联办事项', phase_order: 3, title: '税务登记与税种核定', description: '系统自动向税务系统推送信息，登录电子税务局申请开税种', sort_order: 4 },
  { phase: '三、同步联办事项', phase_order: 3, title: '申领电子发票', description: '在电子税务局申请领用电子发票', sort_order: 5 },
  { phase: '三、同步联办事项', phase_order: 3, title: '社保/公积金开户', description: '通过全链通平台同步办理社保和公积金账户', sort_order: 6 },

  // 四、合规运营准备
  { phase: '四、合规运营准备', phase_order: 4, title: '建立独立的个人与公司财务边界', description: '切勿用个人微信/支付宝直接收取公司营业款，或频繁用公司账户支付个人消费。绝对严格划分', sort_order: 1 },
  { phase: '四、合规运营准备', phase_order: 4, title: '选择并签约会计师事务所', description: '一人公司每年必须经会计师事务所审计，年度财务会计报告需审计。这是证明"公司财产独立于股东个人财产"的核心法律证据', sort_order: 2 },
  { phase: '四、合规运营准备', phase_order: 4, title: '建立公司记账系统', description: '从第一天起规范记账，为年度审计做好准备', sort_order: 3 },
  { phase: '四、合规运营准备', phase_order: 4, title: '了解小微企业税收优惠政策', description: '企业所得税可低至5%（小型微利企业）、"六税两费"减半征收。确保合规的同时享受最大优惠', sort_order: 4 },
  { phase: '四、合规运营准备', phase_order: 4, title: '绝不签署个人连带担保', description: '初创期如有任何合同、贷款要求以个人名义签连带责任担保，一律拒绝。这是有限责任的核心保障', sort_order: 5 },

  // 五、园区政策申请
  { phase: '五、园区政策申请', phase_order: 5, title: '申报"国家科技型中小企业"入库', description: '入库后研发费用加计扣除100%（投入10万可扣20万），还可申请低息"科贷通"信用贷款', sort_order: 1 },
  { phase: '五、园区政策申请', phase_order: 5, title: '了解并申请智能算力租用补贴', description: '符合条件的企业可获实际支付费用30%的算力补贴，每年最高200万元', sort_order: 2 },
  { phase: '五、园区政策申请', phase_order: 5, title: '评估模型备案奖励资格', description: '自研模型通过国家网信办《生成式人工智能服务备案》后，每个模型可获50万元一次性奖励', sort_order: 3 },
  { phase: '五、园区政策申请', phase_order: 5, title: '关注"金鸡湖科技领军人才计划"', description: '如有硬核技术/留学背景/核心知识产权，可申报获得80~300万创业启动资金、3年免租场所、最高200万购房补贴', sort_order: 4 },

  // 六、AI创业启动
  { phase: '六、AI创业启动', phase_order: 6, title: '设定创业资金止损线', description: '算出可承受的闲置资金上限，放入独立账户作为"创业沙盒"，心里假定这笔钱已经归零', sort_order: 1 },
  { phase: '六、AI创业启动', phase_order: 6, title: '设定时间盒（Time-boxing）', description: '给自己一个明确的验证期限，全力以赴跑通MVP，到期无起色则及时止损', sort_order: 2 },
  { phase: '六、AI创业启动', phase_order: 6, title: '寻找微小而痛苦的垂直利基市场', description: '不要做"全能AI助手"，找到大公司看不上但特定人群痛苦不堪的小格子（Micro-SaaS方向）', sort_order: 3 },
  { phase: '六、AI创业启动', phase_order: 6, title: '"零代码"验证真实需求', description: '先不写代码，用最小成本（问卷、访谈、竞品差评分析等）验证目标用户是否真的愿意为这个痛点付费', sort_order: 4 },
  { phase: '六、AI创业启动', phase_order: 6, title: '建立垂直内容账号与Waitlist', description: '在小红书/TikTok等平台建立垂直账号，通过内容获取流量，建立Landing Page收集候补名单验证需求', sort_order: 5 },
  { phase: '六、AI创业启动', phase_order: 6, title: '利用"影子后端"策略快速上线MVP', description: '前端精致、流程顺畅，底层走捷径（调现成API/手工跑Prompts），有几十个付费用户后再重构', sort_order: 6 },
  { phase: '六、AI创业启动', phase_order: 6, title: '建立每日"神圣时间盒"', description: '每天雷打不动1~2小时绝对专注期，任务原子化（30分钟内能完成的小格子），工作日小步快跑，周末集中输出', sort_order: 7 },
  { phase: '六、AI创业启动', phase_order: 6, title: '设定副业"转正与退出指标"', description: '明确月收入达到多少可全职、亏损到多少需关停的量化指标', sort_order: 8 },
];

async function seed() {
  try {
    await pool.query('DELETE FROM tasks');
    console.log('Cleared existing tasks');

    for (const task of tasks) {
      await pool.query(
        `INSERT INTO tasks (phase, phase_order, title, description, status, sort_order)
         VALUES ($1, $2, $3, $4, 'pending', $5)`,
        [task.phase, task.phase_order, task.title, task.description, task.sort_order]
      );
    }

    console.log(`Seeded ${tasks.length} tasks`);

    const result = await pool.query('SELECT COUNT(*) FROM tasks');
    console.log(`Total tasks in DB: ${result.rows[0].count}`);
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : String(err);
    console.error('Seed failed:', message);
    process.exit(1);
  } finally {
    await pool.end();
  }
}

seed();
