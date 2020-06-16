function scrollCreate(rootId, blockClass, lineClass, contentClass) {

	const scrollRoot = document.getElementById(rootId);
	const scrollBlock = document.getElementsByClassName(blockClass)[0];
	const scrollBar = document.getElementsByClassName(lineClass)[0];
	const scrollContent = document.getElementsByClassName(contentClass)[0];



	mainCycle(scrollRoot, scrollBlock, scrollBar, scrollContent);
	checkResize(scrollRoot, scrollBlock, scrollBar, scrollContent);
}

function mainCycle(scrollRoot, scrollBlock, scrollBar, scrollContent) {
	//начальное задание позиций
	scrollBlock.style.right = 0 + 'px';
	scrollContent.style.left = 0 + 'px';
	//количество скроллов для полного прокручивания
	const scrollCount = 9;
	const barWidth = scrollBar.offsetWidth;
	//меняем ширину блока
	scrollBlock.style.width = barWidth / scrollCount + 'px';
	const blockWidth = scrollBlock.offsetWidth;
	//максимальное значение позиции блока
	const maxPosition = blockWidth - barWidth;
	//шаг прокручивания блока
	const stepBlock = -maxPosition / scrollCount;
	//ширина скрытого контента (отрицательное)
	const hiddenContentWidth = scrollRoot.clientWidth - scrollContent.offsetWidth;

	//сдвигание контента при изменении положение скролла
	function scroll(blockPosition) {
		let contentPosition;
		//если выходит за границы
		if (blockPosition <= maxPosition) {
			blockPosition = maxPosition;
			contentPosition = hiddenContentWidth;
		}
		else if (blockPosition >= 0) {
			blockPosition = 0;
			contentPosition = 0;
		}
		//если все хорошо сдвигаем конент на шаг
		else {
			contentPosition = blockPosition * hiddenContentWidth / maxPosition;
		}

		scrollContent.style.left = contentPosition + 'px';
		scrollBlock.style.right = blockPosition + 'px';
	}
	//перемещние мышкой
	scrollBlock.addEventListener('mousedown', e => {
		e.preventDefault();
		let shiftX = e.clientX - scrollBlock.clientWidth;
		//событие при перемещении
		function onMouseMove(e) {
			scroll(-e.pageX + shiftX);
		}
		//удаляем обработчики при отпускании мыши
		function onMouseUp(e) {
			document.removeEventListener('mousemove', onMouseMove);
			document.removeEventListener('mouseup', onMouseUp);
		}
		//вешаем обработчики
		document.addEventListener('mousemove', onMouseMove);
		document.addEventListener('mouseup', onMouseUp);
		//отменяем дефолтное событие на драге
		scrollBlock.ondragstart = () => false;
	});

	//прокручивание колесиком
	scrollBar.addEventListener('wheel', e => {
		e.preventDefault();
		let left = parseInt(scrollBlock.style.right);

		if (e.deltaY > 0) left -= stepBlock;
		else left += stepBlock;
		
		scroll(left);
	});
}

function checkResize(scrollRoot, scrollBlock, scrollBar, scrollContent) {
	let firstsize = scrollContent.offsetWidth;
	setInterval(() => {
		if (firstsize != scrollContent.offsetWidth) {
			firstsize = scrollContent.offsetWidth;
			mainCycle(scrollRoot, scrollBlock, scrollBar, scrollContent);
		}
	}, 300)
}


