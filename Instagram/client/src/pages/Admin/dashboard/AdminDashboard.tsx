import { useCheckToken } from "../../../hooks/useCheckToken";
import AdminLayout from "../../../layouts/AdminLayout";

type AdminDashboardProps = {};

const AdminDashboard: React.FC<AdminDashboardProps> = ({}) => {
  useCheckToken();
  return <AdminLayout title="Admin dashboard"></AdminLayout>;
};

export default AdminDashboard;
