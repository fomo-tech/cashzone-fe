import { useTranslation } from "react-i18next";

// Example component showing how to use translations
const TranslationExample = () => {
  const { t } = useTranslation();

  return (
    <div className="p-6 space-y-4">
      <h1 className="text-2xl font-bold">{t("common.welcome")}</h1>

      {/* Navigation items */}
      <nav className="space-x-4">
        <a href="/">{t("nav.home")}</a>
        <a href="/wallet">{t("nav.wallet")}</a>
        <a href="/referral">{t("nav.referral")}</a>
      </nav>

      {/* Buttons */}
      <div className="space-x-2">
        <button>{t("common.save")}</button>
        <button>{t("common.cancel")}</button>
      </div>

      {/* Status badges */}
      <div className="space-x-2">
        <span>{t("status.pending")}</span>
        <span>{t("status.approved")}</span>
        <span>{t("status.completed")}</span>
      </div>

      {/* Messages */}
      <div>
        <p>{t("messages.confirmDelete")}</p>
        <p>{t("messages.saveSuccess")}</p>
      </div>
    </div>
  );
};

export default TranslationExample;
