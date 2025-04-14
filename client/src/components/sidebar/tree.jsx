import FileTreeNode from "./filetreenode";

const Tree = ({ tree, onSelect }) => {
  return (
    <FileTreeNode nodeName={"/"} path={""} nodes={tree} onSelect={onSelect} />
  );
};

export default Tree;
