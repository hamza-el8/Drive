import { useSelector } from 'react-redux';
import { RootState } from '@/redux/store';
import FileGrid from '@/components/FileGrid';

const FavoritesPage = () => {
  const items = useSelector((s: RootState) => s.files.items.filter(i => i.isFavorite && !i.isTrashed));
  return <FileGrid items={items} title="Favoris" emptyMessage="Aucun fichier favori" />;
};

export default FavoritesPage;
