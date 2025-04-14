import { Folder, FileText } from "lucide-react";

const FileTreeNode = ({ nodeName, nodes }) => {
  const isDir = !!nodes;
  return (
    <div className="ml-4 text-sm leading-6">
      <div className="cursor-pointer flex items-center gap-2 hover:bg-gray-600">
        {isDir ? <Folder size={16} /> : <FileText size={16} />}
        {nodeName}
      </div>
      {nodes && (
        <ul>
          {Object.keys(nodes).map((child) => {
            return (
              <li key={child}>
                <FileTreeNode nodeName={child} nodes={nodes[child]} />
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
};

export default FileTreeNode;
