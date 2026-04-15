import { useSelector } from 'react-redux';
import { RootState } from '@/redux/store';
import FileGrid from '@/components/FileGrid';

const RecentPage = () => {
  const items = useSelector((s: RootState) =>
    [...s.files.items]
      .filter(i => !i.isTrashed)
      .sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime())
      .slice(0, 20)
  );
  return <FileGrid items={items} title="Récents" emptyMessage="Aucune activité récente" />;
};

export default RecentPage;
