class Scroll {
	constructor(blockId, mode = 0) {
		this._scrollRoot = document.getElementById(blockId);
		this._scrollLine = this._createElement(mode);
		this._scrollBlock = this._scrollLine.firstElementChild;

		this._content = this._scrollRoot.firstElementChild;

		this._scrollRoot.appendChild(this._scrollLine);

		this._scrollStep = 50;

		this._scrollLineSize = mode === 0 ?
		  this._scrollLine.clientHeight - this._scrollBlock.offsetHeight - 2 * parseInt(getComputedStyle(this._scrollLine).paddingBottom) :
		  this.srollLineSize =  this._scrollLine.clientWidth - this._scrollBlock.offsetWidth - 2 * parseInt(getComputedStyle(this._scrollLine).paddingRight); 		

		this._sizeOverflow = mode === 0 ? 
		  this._content.offsetHeight - this._scrollRoot.clientHeight :
		  this._content.offsetWidth - this._scrollRoot.clientWidth

		this._blockStep = this._scrollLineSize * this._scrollStep / this._sizeOverflow;
		this.scrollState = 0;
		this.blockState = 0;

		this._initStyle(mode);
		
		if (mode === 1) this._scrollRoot.addEventListener('wheel', this._onScrollWidth.bind(this))
		else this._scrollRoot.addEventListener('wheel', this._onScrollHeight.bind(this))
	}

	_initStyle(mode) {
		this._content.style.position = 'relative';
		if (mode === 1) {
			this._content.style.right = 0;
			this._scrollBlock.style.right = 0;
		} else {
			this._content.style.top = 0;
			this._scrollBlock.style.top = 0;
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
			this.scrollState -= this._scrollStep;
			if (this.scrollState < 0) this.scrollState = 0;

			this.blockState += this._blockStep;
			if (this.blockState > 0) this.blockState = 0;
		}
		else {
			this.scrollState += this._scrollStep;
			if (this.scrollState > this._sizeOverflow) this.scrollState = this._sizeOverflow;

			this.blockState -= this._blockStep;
			if (this.blockState < -this._scrollLineSize) this.blockState = -this._scrollLineSize;
		}

		this._content.style.right = `${this.scrollState}px`;
		this._scrollBlock.style.right = `${this.blockState}px`;
	}

	_onScrollHeight(e) {
		e.preventDefault();

		if (e.deltaY > 0) {
			this.scrollState -= this._scrollStep;
			if (this.scrollState < -this._sizeOverflow) this.scrollState = -this._sizeOverflow;

			this.blockState += this._blockStep;
			if (this.blockState > this._scrollLineSize) this.blockState = this._scrollLineSize;
		}
		else {
			this.scrollState += this._scrollStep;
			if (this.scrollState > 0) this.scrollState = 0;

			this.blockState -= this._blockStep;
			if (this.blockState < 0) this.blockState = 0;
		}

		this._content.style.top = `${this.scrollState}px`;
		this._scrollBlock.style.top = `${this.blockState}px`;
	}
}
