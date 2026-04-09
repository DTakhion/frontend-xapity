import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { ReactNode } from 'react';

interface DialogDemoProps {
  /**
   *
   * @description Render the button that will open the dialog
   */
  renderToggleButton: () => ReactNode,
  /**
   *
   * @description Render the content of the dialog
   */
  renderContent: () => ReactNode,
  title?: string,
  description?: string,
  width?: number,
  renderFooter?: () => ReactNode,
}
export function BaseDialog({ renderToggleButton, description, title, renderFooter, renderContent, width = 500 }: DialogDemoProps) {
  return (
    <Dialog>
      <DialogTrigger asChild>
        {renderToggleButton()}
      </DialogTrigger>

      <DialogContent style={{ maxWidth: width }}>
        {title && (
          <DialogHeader>
            <DialogTitle className="text-xl">{title}</DialogTitle>
            {description && (
              <DialogDescription>
                {description}
              </DialogDescription>
            )}
          </DialogHeader>
        )}

        {renderContent()}

        {renderFooter && (
          <DialogFooter>
            {renderFooter()}
          </DialogFooter>
        )}
      </DialogContent>
    </Dialog>
  );
}
