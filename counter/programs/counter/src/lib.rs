use anchor_lang::prelude::*;

declare_id!("HpjTvLKu963kUo3LcxKNmFVYgBHDMGgxyDWV3ZHPNZv2");

#[program]
pub mod counter {
    use super::*;

    pub fn initialize(ctx: Context<Initialize>) -> Result<()> {
        let counter = &mut ctx.accounts.counter;
        counter.bump = ctx.bumps.counter; // 将 bump 种子存储在 `Counter` 账户中
        msg!("Counter account created! Current count: {}", counter.count);
        msg!("Counter bump: {}", counter.bump);
        Ok(())
    }

    pub fn increment(ctx: Context<Increment>) -> Result<()> {
        let counter = &mut ctx.accounts.counter;
        msg!("Previous counter: {}", counter.count);
        counter.count = counter.count.checked_add(1).unwrap();
        msg!("Counter incremented! Current count: {}", counter.count);
        Ok(())
    }
}

#[derive(Accounts)]
pub struct Initialize<'info> {
    #[account(mut)]
    pub user: Signer<'info>,

    // 使用 PDA 作为地址创建并初始化 `Counter` 账户
    #[account(
        init,
        seeds = [b"counter"], // PDA 的可选种子
        bump,                 // PDA 的 bump 种子
        payer = user,
        space = 8 + Counter::INIT_SPACE
    )]
    pub counter: Account<'info, Counter>,
    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
pub struct Increment<'info> {
    // `Counter` 账户的地址必须使用指定的 `seeds` 派生的 PDA
    #[account(
        mut,
        seeds = [b"counter"], // PDA 的可选种子
        bump = counter.bump,  // 存储在 `Counter` 账户中的 PDA bump 种子
    )]
    pub counter: Account<'info, Counter>,
}

#[account]
#[derive(InitSpace)]
pub struct Counter {
    pub count: u64, // 8 字节
    pub bump: u8,   // 1 字节
}