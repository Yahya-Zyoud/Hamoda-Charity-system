import { useEffect, useState } from "react";
import { getStats } from "../../services/api";
import { Users, FolderKanban, HeartHandshake, Globe, AlertTriangle } from "lucide-react";

const IconMap = { Users, FolderKanban, HeartHandshake, Globe };

function StatCard({ stat }) {
  const Icon = IconMap[stat.icon] || Users;

  return (
    <div className="bg-white p-6 rounded-2xl shadow text-center">
      <Icon className="mx-auto mb-3 text-blue-600" size={30} />
      <h3 className="text-3xl font-bold text-blue-600">
        {stat.value}{stat.suffix}
      </h3>
      <p className="font-semibold">{stat.label}</p>
      <span className="text-sm text-gray-500">{stat.sublabel}</span>
    </div>
  );
}

export default function StatsSection() {
  const [stats, setStats] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadStats = async () => {
      try {
        const res = await getStats();
        if (res.success) {
          setStats(res.data);
        }
      } catch {
        setError("فشل تحميل الإحصائيات");
      } finally {
        setLoading(false);
      }
    };

    loadStats();
  }, []);

  if (loading) return <p className="text-center">جاري التحميل...</p>;

  if (error) {
    return (
      <div className="text-center text-red-500">
        <AlertTriangle className="mx-auto mb-2" />
        {error}
      </div>
    );
  }

  return (
    <section className="py-16 bg-gray-50" dir="rtl">
      <div className="max-w-6xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-6">
        {stats.map((stat) => (
          <StatCard key={stat.id} stat={stat} />
        ))}
      </div>
    </section>
  );
}
