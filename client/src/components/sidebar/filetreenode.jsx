import { Folder, FileText } from "lucide-react";

const FileTreeNode = ({ nodeName, nodes, onSelect, path }) => {
  const isDir = !!nodes;
  return (
    <div
      onClick={(e) => {
        e.stopPropagation();
        if (isDir) {
          return;
        }
        onSelect(path);
      }}
      className="ml-4 text-sm leading-6"
    >
      <div className="cursor-pointer flex items-center gap-2 hover:bg-gray-600">
        {isDir ? <Folder size={16} /> : <FileText size={16} />}
        {nodeName}
      </div>
      {nodes && nodeName !== "node_modules" && (
        <ul>
          {Object.keys(nodes).map((child) => {
            return (
              <li key={child}>
                <FileTreeNode
                  path={`${path}/${child}`}
                  nodeName={child}
                  nodes={nodes[child]}
                  onSelect={onSelect}
                />
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
};

export default FileTreeNode;
