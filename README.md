# Solana Counter dApp

一个完整的 Solana 全栈去中心化应用，包含链上智能合约和 React 前端。用户可以通过钱包连接并与部署在 Solana Devnet 上的计数器程序交互。

## 项目结构

```
.
├── counter/              # Anchor 智能合约项目
│   ├── programs/
│   │   └── counter/
│   │       └── src/
│   │           └── lib.rs       # 主合约代码
│   ├── tests/
│   │   └── counter.ts           # 合约测试
│   ├── Anchor.toml              # Anchor 配置
│   └── target/
│       ├── idl/
│       │   └── counter.json     # 生成的 IDL
│       └── types/
│           └── counter.ts       # TypeScript 类型定义
└── front-end/           # React 前端项目
    ├── src/
    │   ├── anchor/
    │   │   ├── idl.json        # 从 target/idl 复制的 IDL
    │   │   └── setup.ts        # Program 连接配置
    │   ├── components/
    │   │   ├── counter-state.tsx    # 显示计数器状态
    │   │   └── increment-button.tsx # 增加计数按钮
    │   ├── App.tsx             # 主应用组件
    │   └── main.tsx
    ├── package.json
    └── vite.config.ts
```

## 功能特性

- ✅ 使用 PDA (Program Derived Address) 安全存储链上数据
- ✅ 实时订阅链上账户变化，自动更新 UI
- ✅ 钱包适配器集成 (Phantom, Solflare, Backpack)
- ✅ 完整的 TypeScript 类型支持
- ✅ 部署到 Solana Devnet

## 技术栈

**后端 (链上程序):**
- Rust
- Anchor Framework 0.29
- Solana CLI

**前端:**
- React 18
- TypeScript
- Vite
- @solana/web3.js
- @solana/wallet-adapter
- @coral-xyz/anchor

## 环境要求

- Node.js 16+
- Yarn 1.22+
- Rust (最新稳定版)
- Solana CLI 1.18+
- Anchor CLI 0.29
- Solana 浏览器钱包 (Phantom 推荐)

## 安装步骤

### 1. 克隆项目

```bash
git clone <your-repo-url>
cd <project-directory>
```

### 2. 安装后端依赖

```bash
cd counter
anchor build
```

### 3. 配置 Solana 网络

```bash
# 设置为 devnet
solana config set --url devnet

# 检查配置
solana config get

# 获取测试代币 (如果余额不足)
solana airdrop 2
```

### 4. 部署合约到 Devnet

```bash
# 部署程序
anchor deploy

# 运行测试
anchor test
```

记录输出的 **Program ID**，后面会用到。

### 5. 安装前端依赖

```bash
cd ../front-end
yarn install
```

### 6. 配置前端

编辑 `front-end/src/anchor/setup.ts`，将 `PROGRAM_ID` 替换为你部署的程序地址：

```typescript
const PROGRAM_ID = "你的Program ID";
```

### 7. 运行前端

```bash
yarn dev
```

访问 `http://localhost:5173/`

## 使用指南

1. **安装 Phantom 钱包**
   - 访问 https://phantom.app/
   - 安装浏览器扩展

2. **切换到 Devnet**
   - 打开 Phantom 设置
   - Developer Settings → Change Network → Devnet

3. **获取测试 SOL**
   - 访问 https://faucet.solana.com/
   - 输入你的钱包地址
   - 获取免费测试币

4. **连接 dApp**
   - 点击 "Select Wallet"
   - 选择 Phantom
   - 授权连接

5. **增加计数器**
   - 点击 "Increment" 按钮
   - 在 Phantom 中确认交易
   - 等待交易确认，计数器自动更新

## 开发指南

### 修改合约逻辑

1. 编辑 `counter/programs/counter/src/lib.rs`
2. 运行 `anchor build` 编译
3. 运行 `anchor test` 测试
4. 如果合约大小变化，可能需要扩展程序账户：
   ```bash
   solana program extend <PROGRAM_ID> <额外字节数>
   ```
5. 运行 `anchor deploy` 重新部署

### 更新前端

1. 如果修改了合约结构，重新复制 IDL：
   ```bash
   cp counter/target/idl/counter.json front-end/src/anchor/idl.json
   ```
2. 修改 React 组件代码
3. Vite 会自动热重载

## 合约说明

### 账户结构

```rust
pub struct Counter {
    pub count: u64,  // 计数值
    pub bump: u8,    // PDA bump seed
}
```

### 指令

- `initialize()`: 创建计数器账户 (PDA)
- `increment()`: 增加计数值 +1

### PDA 派生

```typescript
const [counterPDA] = PublicKey.findProgramAddressSync(
  [Buffer.from("counter")],
  programId
);
```

## 故障排除

### 前端无法连接

- 确认钱包已切换到 Devnet
- 检查 `setup.ts` 中的 Program ID 是否正确
- 清除浏览器缓存或 Vite 缓存：
  ```bash
  rm -rf node_modules/.vite
  yarn dev
  ```

### 交易失败

- 确认钱包有足够的 SOL (至少 0.001 SOL)
- 检查浏览器控制台错误信息
- 在 Solana Explorer 查看交易详情

### Buffer 模块错误

如果看到 "Module buffer has been externalized" 错误：
- 确认已安装 `buffer` 包：`yarn add buffer`
- 检查 `vite.config.ts` 配置是否正确

## 已部署信息

- **Network**: Solana Devnet
- **Program ID**: `HpjTvLKu963kUo3LcxKNmFVYgBHDMGgxyDWV3ZHPNZv2`
- **Explorer**: [View on Solana Explorer](https://explorer.solana.com/address/HpjTvLKu963kUo3LcxKNmFVYgBHDMGgxyDWV3ZHPNZv2?cluster=devnet)

## 下一步扩展

- [ ] 添加 decrement 功能
- [ ] 多用户计数器 (每个钱包独立计数)
- [ ] 添加重置功能
- [ ] 美化 UI 界面
- [ ] 部署到 Vercel/Netlify
- [ ] 迁移到 Mainnet

## 学习资源

- [Solana 开发文档](https://docs.solana.com/)
- [Anchor 框架指南](https://www.anchor-lang.com/)
- [Solana Cookbook](https://solanacookbook.com/)

## 许可证

MIT

## 作者

@Cichlider