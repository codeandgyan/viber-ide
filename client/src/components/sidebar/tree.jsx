import FileTreeNode from "./filetreenode";

const Tree = ({ tree }) => {
  return <FileTreeNode nodeName={"/"} nodes={tree} />;
};

export default Tree;
