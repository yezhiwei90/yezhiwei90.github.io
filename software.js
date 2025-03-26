		// The code to display softwares
		const stackimages = [
			{src: './Resources/Soft/1.png',
			caption: 'Spectral Analyzer<br>量子产率、摩尔消光系数、pka计算'},
			{
				src: './Resources/Soft/2.png',
				caption: '光谱分析数据界面<br>颜色、线型设置'
			},
			{
				src: './Resources/Soft/3.PNG',
				caption: 'Single-molecule analyzer<br>单分子荧光光物理性质解析'
			},
			{
				src: './Resources/Soft/4.png',
				caption: 'Light Carver<br>分子定位解析'
			},
			{
				src: './Resources/Soft/5.png',
				caption: 'Render<br>定位数据后处理及重建'
			},
			{
				src: './Resources/Soft/6.png',
				caption: 'Single-molecule simulator<br>单分子荧光光物理模拟器'
			},
			{
				src: './Resources/Soft/7.png',
				caption: 'Single-molecule track<br>单分子运动追踪、解析'
			},
		  // 添加更多图片路径...
		];

		const stackimgcontainer = document.getElementById('stackContainer');
		stackimgcontainer.style.overflow = 'hidden'; /* 允许横向滚动 */

		// 为每个 card 定义一个定时器 ID 存储变量
		let globalleaveTimer = null;
		let globalleaveTimer2 = null;
		let hoverCount = 0; // 当前悬停的卡片数量
		stackimages.forEach((item, index) => {
			  // 创建卡片容器
			  const card = document.createElement('div');
			  card.className = 'stack-card';
			  card.style.cssText = `
			    z-index: ${index};
			  `;

		  const imgElem = document.createElement('img');
		  imgElem.src = item.src;
		  imgElem.className = 'dynamic-stacked';
		  imgElem.style.cssText = `
		  	height:130px;
		  `;
		  

		  // 添加文字说明
		  const caption = document.createElement('div');
		  caption.className = 'image-caption';
		  caption.innerHTML = item.caption;

		  // 组装元素
		  card.appendChild(imgElem);
		  card.appendChild(caption);
		  stackimgcontainer.appendChild(card);

				  // 添加移动端触摸事件
				  let tapTimer;
				  let tapStartTime;
				  let isScrolling = false;

				  // 统一处理触摸开始
				  card.addEventListener('touchstart', function(e) {
				    tapStartTime = Date.now();
				    isScrolling = false;
				    
				    // 短按处理
				    tapTimer = setTimeout(() => {
				      if(!isScrolling) {
				        this.classList.add('active');
				        card.style.zIndex = 999;
				        imgElem.style.zIndex = 999;
				        stackimgcontainer.style.overflow = 'visible';
				      }
				    }, 200);
				  });

				  // 处理触摸移动（滚动时取消激活）
				  card.addEventListener('touchmove', function(e) {
				    isScrolling = true;
				    clearTimeout(tapTimer);
				    this.classList.remove('active');
				  });

				  // 处理触摸结束
				  card.addEventListener('touchend', function(e) {
				    clearTimeout(tapTimer);
				    const tapDuration = Date.now() - tapStartTime;
				    
				    // 短按小于500ms时保持激活状态
				    if(tapDuration < 500 && !isScrolling) {
				      // 移除其他卡片的激活状态
				      document.querySelectorAll('.stack-card').forEach(c => {
				        if(c !== this) c.classList.remove('active');
				      });
				    } else {
				      this.classList.remove('active');
				    }
				    
				    // 重置状态
				    isScrolling = false;
				    tapTimer = null;
				  });

				  // 点击外部区域关闭激活状态
				  document.addEventListener('touchstart', function(e) {
				    if(!e.target.closest('.stack-card')) {
				      document.querySelectorAll('.stack-card').forEach(c => {
				        c.classList.remove('active');
				        stackimgcontainer.style.overflow = 'hidden';
				      });
				    }
				  });

   		 // Add hover event listeners  
        card.addEventListener('mouseenter', function() {  
        	clearTimeout(globalleaveTimer2);
        	hoverCount++; // 增加悬停计数
            card.style.zIndex = 999; // Change z-index on hover  
            stackimgcontainer.style.overflow = 'visible';
        });  

        card.addEventListener('mouseleave', function() {  
        	hoverCount--; // 减少悬停计数
	        	clearTimeout(globalleaveTimer);

	            globalleaveTimer =  setTimeout(function() {  
			        card.style.zIndex = index; // Reset z-index on mouse leave  
			        imgElem.style.zIndex = index;
		    		}, 300);
        	if  (hoverCount === 0) {
	        	clearTimeout(globalleaveTimer2);
	            globalleaveTimer2 =  setTimeout(function() {  
        		stackimgcontainer.style.overflow = 'hidden';  
	        	},300);
	        }

        });  

        stackimgcontainer.appendChild(card);
		});
