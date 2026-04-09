import { GalleryVerticalEnd } from 'lucide-react';

export const AppLogo = () => {
  return (
    <div className="flex items-center gap-2 font-medium">
      <div className="flex h-6 w-6 items-center justify-center rounded-md bg-primary text-primary-foreground">
        <GalleryVerticalEnd className="size-4" />
      </div>
      Client Recommender
    </div>
  );
};
