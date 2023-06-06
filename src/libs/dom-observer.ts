export function DOMObserver(targetClassName: string) {
  return new MutationObserver((mutationsList) => {
    // 遍历每个变化的节点
    for (const mutation of mutationsList) {
      // 检查每个已添加的节点
      if (mutation.type === 'childList') {
        const addedNodes = mutation.addedNodes;
        for (const node of addedNodes) {
          // 检查是否是目标类名的元素
          if (node instanceof Element && node.classList.contains(targetClassName)) {
            // 目标元素已创建，执行你的操作
            console.log('目标元素已创建:', node);
          }
        }
      }
    }
  });
}
