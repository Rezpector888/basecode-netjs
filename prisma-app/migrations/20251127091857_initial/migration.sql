BEGIN TRY

BEGIN TRAN;

-- CreateTable
CREATE TABLE [rostering].[members] (
    [id] NVARCHAR(1000) NOT NULL,
    [created_at] DATETIME2 NOT NULL CONSTRAINT [members_created_at_df] DEFAULT CURRENT_TIMESTAMP,
    [updated_at] DATETIME2 NOT NULL,
    CONSTRAINT [members_pkey] PRIMARY KEY CLUSTERED ([id])
);

-- CreateTable
CREATE TABLE [rostering].[schedules] (
    [id] NVARCHAR(1000) NOT NULL,
    [member_id] NVARCHAR(1000) NOT NULL,
    [start_date] DATETIME2 NOT NULL,
    [end_date] DATETIME2 NOT NULL,
    [created_at] DATETIME2 NOT NULL CONSTRAINT [schedules_created_at_df] DEFAULT CURRENT_TIMESTAMP,
    [updated_at] DATETIME2 NOT NULL,
    CONSTRAINT [schedules_pkey] PRIMARY KEY CLUSTERED ([id])
);

-- CreateIndex
CREATE NONCLUSTERED INDEX [schedules_id_idx] ON [rostering].[schedules]([id]);

-- CreateIndex
CREATE NONCLUSTERED INDEX [schedules_member_id_idx] ON [rostering].[schedules]([member_id]);

-- AddForeignKey
ALTER TABLE [rostering].[schedules] ADD CONSTRAINT [schedules_member_id_fkey] FOREIGN KEY ([member_id]) REFERENCES [rostering].[members]([id]) ON DELETE NO ACTION ON UPDATE CASCADE;

COMMIT TRAN;

END TRY
BEGIN CATCH

IF @@TRANCOUNT > 0
BEGIN
    ROLLBACK TRAN;
END;
THROW

END CATCH
