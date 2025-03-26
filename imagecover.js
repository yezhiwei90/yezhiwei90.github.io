
				// this code add the interactive divider in the main page.
			  window.addEventListener('DOMContentLoaded', () => {
			    const divider = document.getElementById('divider');
			    const image1 = document.getElementById('image1');
			    const image2 = document.getElementById('image2');
			    const container = document.querySelector('.slidecontainer'); // 需要监听的容器
			      // 新增元素引用
				const dragTip = document.querySelector('.drag-tip');
				let tipTimeout = null;

			    // 动画状态控制
				let isAnimating = false;
				let hasAnimated = false;
			    let position = 100;

			    // 初始状态：分隔线在右侧，图片完全隐藏
			    const resetElements = () => {
				    divider.style.left = `100%`;
				    image1.style.clipPath = `inset(0% 0% 0% 0%)`;
				    image2.style.clipPath = `inset(0% 0% 0% 100%)`;
				};
				resetElements();

				  // Intersection Observer 配置
				  const observer = new IntersectionObserver((entries) => {
				    entries.forEach(entry => {
				      if (entry.isIntersecting) {
				        // 元素进入视口且未执行过动画
				        if (!hasAnimated) {
				          startAnimation();
				          hasAnimated = true;
				        }
				      } else {
				        // 元素离开视口时重置状态
				        dragTip.parentElement.classList.remove('show-tip');
				        clearTimeout(tipTimeout);
				        resetElements();
				        hasAnimated = false;
				      }
				    });
				  }, {
				    threshold: 0.7, // 当50%元素可见时触发
				    rootMargin: '0px'
				  });

				// 开始监听目标容器
				observer.observe(container);

				// 动画函数
				const startAnimation = () => {
					if (isAnimating) return;
					isAnimating = true;

					const duration = 2000;
					const startTime = Date.now();
					const startPosition = 100;

					const animateFrame = () => {
					  const elapsed = Date.now() - startTime;
					  const progress = Math.min(elapsed / duration, 1);
					  const position = startPosition - progress * 75; // 100% -> 25%

					  divider.style.left = `${position}%`;
					  image1.style.clipPath = `inset(0% ${100 - position}% 0% 0%)`;
					  image2.style.clipPath = `inset(0% 0% 0% ${position}%)`;

					  if (progress < 1) {
					    requestAnimationFrame(animateFrame);
					  } else {
					    isAnimating = false;
					    showDragTip(); // 显示提示
					    bindDragEvent(); // 绑定拖拽交互
					  }
					};

				requestAnimationFrame(animateFrame);
				};

				 // 显示提示
				  const showDragTip = () => {
				    dragTip.parentElement.classList.add('show-tip');
				    clearTimeout(tipTimeout);
				    tipTimeout = setTimeout(() => {
				      dragTip.parentElement.classList.remove('show-tip');
				    }, 5000); // 5秒后隐藏
				  };


			    // 绑定拖拽交互
			    const bindDragEvent = () => {
					// 修改后的触摸/鼠标通用代码
					let isDragging = false;
					let startX = 0;
					let currentX = 0;

					// 统一处理拖动开始
					function startDrag(e) {
					    e.preventDefault();
					    isDragging = true;
					    
					    // 获取初始位置（支持触摸事件）
					    const clientX = e.touches ? e.touches[0].clientX : e.clientX;
					    startX = clientX;
					    currentX = clientX;

					    // 添加事件监听
					    document.addEventListener('mousemove', onDrag);
					    document.addEventListener('touchmove', onDrag, { passive: false });
					    document.addEventListener('mouseup', endDrag);
					    document.addEventListener('touchend', endDrag);
					}

					// 统一处理拖动过程
					function onDrag(e) {
					    if (!isDragging) return;
					    e.preventDefault();

					    // 获取当前位置（支持触摸事件）
					    const clientX = e.touches ? e.touches[0].clientX : e.clientX;
					    currentX = clientX;

					    // 计算容器位置和宽度
					    const container = divider.parentElement;
					    const rect = container.getBoundingClientRect();
					    
					    // 计算新位置（限制在0-100%之间）
					    const deltaX = currentX - startX;
					    const newPosition = (clientX - rect.left) / rect.width * 100;
					    position = Math.min(Math.max(newPosition, 0), 100);

					    // 更新UI
					    divider.style.left = `${position}%`;
					    image1.style.clipPath = `inset(0% ${100 - position}% 0% 0%)`;
					    image2.style.clipPath = `inset(0% 0% 0% ${position}%)`;

					    // 更新起始位置以实现连续拖动
					    startX = clientX;
					}

					// 统一处理拖动结束
					function endDrag() {
					    isDragging = false;
					    document.removeEventListener('mousemove', onDrag);
					    document.removeEventListener('touchmove', onDrag);
					    document.removeEventListener('mouseup', endDrag);
					    document.removeEventListener('touchend', endDrag);
					}

					// 事件监听（同时支持触摸和鼠标）
					divider.addEventListener('mousedown', startDrag);
					divider.addEventListener('touchstart', startDrag);

			    };

			  	});