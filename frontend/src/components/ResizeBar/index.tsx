import { Header, ColumnResizeDirection } from '@tanstack/react-table';
import { motion } from 'framer-motion';

interface ResizeBarProps<T> {
  header: Header<T, unknown>;
}

const ResizeBar = <T extends object>({ header }: ResizeBarProps<T>) => (
  <motion.div
    onDoubleClick={() => header.column.resetSize()}
    onMouseDown={header.getResizeHandler()}
    onTouchStart={header.getResizeHandler()}
    className={`absolute top-0 h-full w-[4px] bg-slate-400 cursor-col-resize select-none touch-none right-0 opacity-0 hover:opacity-[50] ${
      header.column.getIsResizing() ? 'bg-slate-700 opacity-100' : ''
    }`}
  />
);
export default ResizeBar;
