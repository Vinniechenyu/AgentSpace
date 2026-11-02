#!/usr/bin/env python3
"""Extract the Lucide icons the demo uses from lucide-react into assets/lucide-icons.json.

Each demo icon name maps to the Lucide icon whose meaning matches how the demo uses it.
Re-run after changing ICON_MAP:  python3 lucide-extract.py [path/to/node_modules/lucide-react]
"""
import json, re, sys
from pathlib import Path

HERE = Path(__file__).resolve().parent
PKG = Path(sys.argv[1]) if len(sys.argv) > 1 else HERE.parent / 'agentspace-react/node_modules/lucide-react'

# demo icon name -> Lucide icon (chosen by what the icon stands for in the demo)
ICON_MAP = {
    # navigation · spaces
    'personal': 'user-round',            # 个人视图 / 责任人
    'team': 'users-round',               # 项目视图 / 团队协作
    'chat': 'message-square-text',       # 消息 / 线程
    'bench': 'layout-dashboard',         # 工作台
    'task': 'list-checks',               # 我的任务
    'workflow': 'workflow',              # Workflow 构建
    'grid': 'blocks',                    # 扩展
    'discover': 'package-search',        # 从 AgentCenter 查找与导入扩展
    'tour': 'map',                       # 逛一圈（产品导览）
    'evolution': 'dna',                  # 进化中心
    'home': 'house',                     # 主页 / 概览
    'settings': 'settings',
    'help': 'circle-question-mark',     # 演示说明
    'panelLeft': 'panel-left',           # 收起 / 展开侧栏
    # agents · capabilities
    'agent': 'bot',                      # Agent 节点
    'spark': 'sparkles',                 # AI 生成 / Skill / 个人助理
    'mcp': 'plug',                       # MCP 工具连接
    'terminal': 'square-terminal',       # CLI 工具
    'code': 'code-xml',                  # 代码仓库 / CodeAgent
    'approve': 'user-check',             # 人工确认
    'condition': 'split',                # 条件分支
    'memory': 'brain',                   # 记忆
    'observe': 'eye',                    # 观察
    'evaluate': 'clipboard-check',       # 评估
    'improve': 'trending-up',            # 改进
    'cloud': 'cloud',                    # 云端执行环境
    'shield': 'shield-check',            # 权限 / 来源可信
    'link': 'link',
    'file': 'file-text',
    'book': 'book-open',                 # 知识空间
    'clock': 'clock',
    # actions
    'plus': 'plus', 'close': 'x', 'check': 'check', 'search': 'search',
    'send': 'arrow-up',                  # Composer 发送
    'arrow': 'arrow-right', 'back': 'arrow-left',
    'chevron': 'chevron-right', 'down': 'chevron-down', 'up': 'chevron-up', 'updown': 'chevrons-up-down',
    'refresh': 'refresh-cw', 'copy': 'copy', 'edit': 'pencil', 'reply': 'reply', 'more': 'ellipsis', 'filter': 'list-filter',
    'play': 'play', 'pause': 'pause', 'stop': 'square',
    'expand': 'maximize-2', 'collapse': 'minimize-2', 'menu': 'menu',
    # status · feedback
    'star': 'star', 'thumb': 'thumbs-up', 'bell': 'bell', 'info': 'info',
}

def node_of(name):
    src = (PKG / 'dist/esm/icons' / f'{name}.mjs').read_text()
    body = re.search(r'node:\s*(\[.*?\])\s*\n\};', src, re.S).group(1)
    items = []
    for tag, attrs in re.findall(r'\[\s*"(\w+)",\s*\{(.*?)\}\s*\]', body, re.S):
        kv = dict(re.findall(r'(\w+):\s*"([^"]*)"', attrs))
        kv.pop('key', None)
        items.append([tag, kv])
    if not items:
        raise SystemExit(f'no nodes parsed for {name}')
    return items

version = json.loads((PKG / 'package.json').read_text())['version']
out = {'source': f'lucide-react@{version} (ISC)', 'map': ICON_MAP, 'icons': {}}
for lucide in sorted(set(ICON_MAP.values())):
    out['icons'][lucide] = node_of(lucide)
dest = HERE / 'assets/lucide-icons.json'
dest.write_text(json.dumps(out, ensure_ascii=False, separators=(',', ':')))
print(f'wrote {dest.name}: {len(out["icons"])} icons from {out["source"]}')
