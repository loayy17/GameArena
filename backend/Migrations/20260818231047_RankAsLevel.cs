using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace backend.Migrations
{
    /// <inheritdoc />
    public partial class RankAsLevel : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.Sql("UPDATE \"Users\" SET \"Rank\" = NULL;");
            migrationBuilder.Sql("ALTER TABLE \"Users\" ALTER COLUMN \"Rank\" TYPE double precision USING \"Rank\"::double precision;");
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.Sql("ALTER TABLE \"Users\" ALTER COLUMN \"Rank\" TYPE character varying(20) USING \"Rank\"::text;");
        }
    }
}
