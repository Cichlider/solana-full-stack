use anchor_lang::prelude::*;

declare_id!("7ZJspHweAcL1tHvuj39nHiUXQGoVgkNg1mB9vyUh3uFa");

#[program]
pub mod counter {
    use super::*;

    pub fn initialize(ctx: Context<Initialize>) -> Result<()> {
        msg!("Greetings from: {:?}", ctx.program_id);
        Ok(())
    }
}

#[derive(Accounts)]
pub struct Initialize {}
