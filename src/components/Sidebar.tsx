import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";

export default function Sidebar() {
  const { t } = useTranslation();

  return (
    <aside style={{ width: 220, borderRight: "1px solid #eee", padding: 12 }}>
      <nav style={{ display: "flex", flexDirection: "column", gap: 8 }}>
        <Link to="/dashboard">{t("sidebar.dashboard")}</Link>
        <Link to="/app/bets">{t("sidebar.bets")}</Link>
        <Link to="/app/ranking">{t("sidebar.ranking")}</Link>
        <Link to="/admin">{t("sidebar.admin")}</Link>
      </nav>
    </aside>
  );
}
