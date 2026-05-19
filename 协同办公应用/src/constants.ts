import { User, Task, MeetingRoom, Approval, Document } from './types';

export const MOCK_USER: User = {
  id: 'u1',
  name: '张三',
  avatar: 'https://picsum.photos/seed/user1/200/200',
  role: 'admin',
  department: '行政部',
  position: '行政主管',
};

export const MOCK_TASKS: Task[] = [
  {
    id: 't1',
    type: 'approval',
    title: '待审批',
    description: '您有一条请假申请待上级审批',
    time: '10:00',
    status: 'pending',
  },
  {
    id: 't2',
    type: 'meeting',
    title: '会议提醒',
    description: '14:30 会议室 A303 签到提醒',
    time: '14:25',
    status: 'urgent',
  },
  {
    id: 't3',
    type: 'trip',
    title: '出差提醒',
    description: '明天 08:00 前往北京出差',
    time: '明天',
    status: 'info',
  },
];

export const MOCK_ROOMS: MeetingRoom[] = [
  {
    id: 'r1',
    name: 'A303',
    floor: '3层',
    capacity: 8,
    equipment: ['投影仪', '视频会议'],
    distance: '50米',
    status: 'available',
  },
  {
    id: 'r2',
    name: 'B201',
    floor: '2层',
    capacity: 12,
    equipment: ['白板', '投影仪'],
    distance: '120米',
    status: 'available',
  },
  {
    id: 'r3',
    name: 'C105',
    floor: '1层',
    capacity: 4,
    equipment: ['显示器'],
    distance: '200米',
    status: 'occupied',
  },
];

export const MOCK_APPROVALS: Approval[] = [
  {
    id: 'a1',
    type: 'leave',
    title: '年假申请',
    initiator: '张三',
    time: '2026-04-11 09:00',
    status: 'pending',
    content: { days: 3, reason: '家中有事' },
  },
  {
    id: 'a2',
    type: 'trip',
    title: '北京出差申请',
    initiator: '张三',
    time: '2026-04-10 15:00',
    status: 'approved',
    content: { destination: '北京', days: 3 },
  },
];

export const MOCK_DOCS: Document[] = [
  {
    id: 'd1',
    title: '差旅政策 V2.0',
    category: 'policy',
    publisher: 'HR部门',
    time: '2026-01-01',
    views: 1250,
    isLatest: true,
    version: 'V2.0',
    status: 'active',
    tags: ['制度', '差旅', '已生效'],
    summary: '本政策适用于所有员工出差, 规定了差旅标准、报销流程...',
    content: `
# 差旅政策 V2.0

## 1. 适用范围
本政策适用于公司全体员工在履行职务过程中的出差行为。

## 2. 差旅标准
### 2.1 交通工具
- **经理级及以上**: 高铁二等座/飞机经济舱
- **普通员工**: 高铁二等座

### 2.2 住宿标准
- **一线城市**: 500元/晚
- **二线城市**: 300元/晚

## 3. 报销流程
1. 提交出差申请并获得审批。
2. 预订交通及住宿。
3. 出差结束后3个工作日内提交报销单。
    `,
  },
  {
    id: 'd1-old',
    title: '差旅政策 V1.0',
    category: 'policy',
    publisher: 'HR部门',
    time: '2025-01-01',
    views: 3200,
    isLatest: false,
    version: 'V1.0',
    status: 'expired',
    tags: ['制度', '差旅', '已失效'],
    summary: '旧版差旅政策，已于2026年1月1日失效。',
    content: '旧版政策内容...',
  },
  {
    id: 'd2',
    title: '出差申请模板',
    category: 'process',
    publisher: '行政部门',
    time: '2026-01-01',
    views: 850,
    isLatest: true,
    tags: ['模板', '出差'],
    summary: '标准出差申请填写指南及模板。',
    content: '请按照以下格式填写出差申请...',
  },
  {
    id: 'd3',
    title: '请假规定',
    category: 'policy',
    publisher: 'HR部门',
    time: '2026-02-15',
    views: 2100,
    isLatest: true,
    tags: ['制度', '考勤', '请假'],
    summary: '公司考勤管理制度及各类假期申请规定。',
    content: '请假规定详细内容...',
  },
  {
    id: 'd4',
    title: '差旅报销流程',
    category: 'process',
    publisher: '财务部门',
    time: '2026-03-01',
    views: 1500,
    isLatest: true,
    tags: ['流程', '报销', '差旅'],
    summary: '详细说明出差后的报销步骤、所需单据及审批时效。',
    content: `
# 差旅报销流程

## 1. 报销时限
出差人员应在返回后 **5个工作日** 内完成报销申请提交。

## 2. 报销材料
- 电子/纸质机票、高铁票行程单。
- 酒店住宿增值税专用发票。
- 餐饮、打车等其他费用发票。

## 3. 审批路径
1. 部门负责人审批。
2. 财务初审。
3. 财务总监终审。
4. 出纳付款。
    `,
  },
  {
    id: 'd5',
    title: '差旅费用标准',
    category: 'policy',
    publisher: '财务部门',
    time: '2026-03-15',
    views: 980,
    isLatest: true,
    tags: ['制度', '标准', '差旅'],
    summary: '规定了不同职级、不同城市的住宿及伙食补贴标准。',
    content: `
# 差旅费用标准

## 1. 住宿标准
- **一线城市**: 500元/天
- **二线城市**: 350元/天
- **三线城市**: 260元/天

## 2. 伙食补贴
- **境内出差**: 100元/天
- **境外出差**: 按国家标准执行

## 3. 交通补贴
- **市内交通**: 凭票报销，或按 80元/天 包干。
    `,
  },
];
