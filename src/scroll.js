class Scroll {
	constructor(blockId, mode = 0) {
		const scrollRoot = document.getElementById(blockId);
		const scrollLine = this._createElement(mode);

		this._scrollBlock = scrollLine.firstElementChild;
		this._content = scrollRoot.firstElementChild;

		scrollRoot.appendChild(scrollLine);

		this._scrollStep = 50;

		this._scrollLineSize = mode === 0 ?
		  scrollLine.clientHeight - this._scrollBlock.offsetHeight - 2 * parseInt(getComputedStyle(scrollLine).paddingBottom) :
		  scrollLine.clientWidth - this._scrollBlock.offsetWidth - 2 * parseInt(getComputedStyle(scrollLine).paddingRight); 		

		this._sizeOverflow = mode === 0 ? 
		  this._content.offsetHeight - scrollRoot.clientHeight :
		  this._content.offsetWidth - scrollRoot.clientWidth

		this._blockStep = this._scrollLineSize * this._scrollStep / this._sizeOverflow;
		this._scrollState = 0;
		this._blockState = 0;
		//default style (position)
		this._initStyle(mode);
		//handle srcoll
		if (mode === 1) scrollRoot.addEventListener('wheel', this._onScrollWidth.bind(this))
		else scrollRoot.addEventListener('wheel', this._onScrollHeight.bind(this))
	}

	_initStyle(mode) {
		this._content.style.position = 'relative';
		if (mode === 1) {
			this._content.style.right = 0;
			this._scrollBlock.style.right = 0;
			this._content.style.transition = 'right 0.3s ease';
		} else {
			this._content.style.top = 0;
			this._scrollBlock.style.top = 0;
			this._content.style.transition = 'top 0.3s ease';
		}
	}

	_createElement(mode) {
		const elem = document.createElement('div');
		elem.classList.add('scroll__line', mode === 1 ? 'scroll__line-width' : 'scroll__line-height');

		const block = document.createElement('div');
		block.classList.add('scroll__block');

		elem.appendChild(block);

		return elem;
	}

	_onScrollWidth(e) {
		e.preventDefault();

		if (e.deltaY > 0) {
			this._scrollState -= this._scrollStep;
			if (this._scrollState < 0) this._scrollState = 0;

			this._blockState += this._blockStep;
			if (this._blockState > 0) this._blockState = 0;
		}
		else {
			this._scrollState += this._scrollStep;
			if (this._scrollState > this._sizeOverflow) this._scrollState = this._sizeOverflow;

			this._blockState -= this._blockStep;
			if (this._blockState < -this._scrollLineSize) this._blockState = -this._scrollLineSize;
		}

		this._content.style.right = `${this._scrollState}px`;
		this._scrollBlock.style.right = `${this._blockState}px`;
	}

	_onScrollHeight(e) {
		e.preventDefault();

		if (e.deltaY > 0) {
			this._scrollState -= this._scrollStep;
			if (this._scrollState < -this._sizeOverflow) this._scrollState = -this._sizeOverflow;

			this._blockState += this._blockStep;
			if (this._blockState > this._scrollLineSize) this._blockState = this._scrollLineSize;
		}
		else {
			this._scrollState += this._scrollStep;
			if (this._scrollState > 0) this._scrollState = 0;

			this._blockState -= this._blockStep;
			if (this._blockState < 0) this._blockState = 0;
		}

		this._content.style.top = `${this._scrollState}px`;
		this._scrollBlock.style.top = `${this._blockState}px`;
	}
}
