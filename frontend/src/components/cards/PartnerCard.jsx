import { getPartnerTheme } from "../../constants/partners";

export const PartnerCard = ({ partner }) => {
  const theme = getPartnerTheme(partner.emoji);
  const color = theme.color;
  const Icon = theme.icon;

  return (
    <div className="flex-shrink-0 w-64 bg-white rounded-2xl p-5 shadow-sm border border-gray-100 hover:shadow-lg hover:scale-105 transition-all duration-300 cursor-pointer group">
      <div
        className={`w-12 h-12 rounded-xl bg-gradient-to-br ${color} flex items-center justify-center text-2xl mb-3 group-hover:scale-110 transition-transform overflow-hidden`}
      >
        {partner.logo ? (
          <img
            src={partner.logo}
            alt={partner.name}
            className="w-full h-full object-contain"
          />
        ) : (
          <Icon className="w-6 h-6 text-white" />
        )}
      </div>

      <p className="text-blue-950 font-bold text-sm leading-tight text-center">
        {partner.name}
      </p>

      <div
        className={`mt-2 h-1 w-8 rounded-full bg-gradient-to-r ${color} group-hover:w-full transition-all duration-500`}
      />
    </div>
  );
};

export default PartnerCard;
