(function (window,Vue,undefind) {
	var list = [
		{
			id: 1,
			content: 'abc',
			isFinish: false
		},
		{
			id: 2,
			content: 'dsdc',
			isFinish: false
		},
		{
			id: 3,
			content: 'sgebc',
			isFinish: true
		}
	]

	new Vue ({
		el: '#app',
		data: {
			dataList: JSON.parse(window.localStorage.getItem('dataList')) || list,
			newTodo: '',
			beforeUpdate: null,
			activeBtn: 1,
			showArr: []

		},
		watch: {
			dataList: {
				handler (newArr) {
					window.localStorage.setItem('dataList',JSON.stringify(newArr))
					this.hashchange()
				},
				deep: true
			}
		},
		methods: {
			//添加一个todo
			addTodo () {
				if (!this.newTodo.trim()) return
				//组装一个对象
				this.dataList.push({
					content: this.newTodo.trim(),
					isFinish: false,
					id: this.dataList.length ? this.dataList.sort((a,b) =>a.id-b.id)[this.dataList.length -1]['id'] + 1 : 1
				})
				this.newTodo=""
			},
			//删除一个todo
			delTodo (index) {
				this.dataList.splice(index,1)
			},
			delAll () {
				this.dataList = this.dataList.filter( item => !item.isFinish)
				// console.log(this.dataList)
			},
			showEdit (index) {
				this.$refs.show.forEach(item=>{item.classList.remove('editing')})
				this.$refs.show[index].classList.add('editing')
				this.beforeUpdate =JSON.parse(JSON.stringify(this.dataList[index])) 
			},
			updateTodo (index) {
				if (!this.dataList[index].content.trim()) return this.dataList.splice(index,1)
				if (this.dataList[index].content !== this.beforeUpdate.content) this.dataList[index].isFinish =false
				this.$refs.show[index].classList.remove('editing')
				this.beforeUpdate = {}
			},
			backTodo (index) {
				this.dataList[index].content = this.beforeUpdate.content
				this.$refs.show[index].classList.remove('editing')
				this.beforeUpdate = {}
			},
			hashchange() {
				switch (window.location.hash) {
					case '':
					case '#/':
						this.showAll()
						this.activeBtn = 1
						break
					case '#/active':
						this.activeAll(false)
						this.activeBtn = 2
						break
					case '#/completed':
						this.activeAll(true)
						this.activeBtn = 3
						break
				}
			},
			showAll () {
				this.showArr = this.dataList.map(()=>true)
			},
			activeAll (boo) {
				this.showArr = this.dataList.map((item)=> item.isFinish == boo)
				//判断是不是有true
				if (this.dataList.every(item => item.isFinish === !boo)) {
					window.location.hash= '#/'
				}
			}
		},
		computed: {
			//计算所有isFinish为false的数量
			activeNum () {
				return this.dataList.filter(item => !item.isFinish).length
			},
			toggleAll : {
				get () {
					//判断每一个都是true
					return this.dataList.every(item => item.isFinish)
				},
				set (val) {
					this.dataList.forEach(item => item.isFinish = val )
				}
			}
			
		},
		directives: {
			focus: {
				inserted(el) {
					el.focus()
				}
			}
		},
		created () {
			this.showAll()
			this.hashchange()
			window.onhashchange = ()=>{
				this.hashchange()
			}
		}

	})

})(window,Vue);
