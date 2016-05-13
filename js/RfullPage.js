

!
	function(window){
		RfullPage={"version":"1.0",authon:"darkness"};
		window.RfullPage=RfullPage;

		jQuery.fn.setpagefunc=function(func){
				this.animefun=func;
			return this;
		};
		jQuery.fn.setoutpagefunc=function(func){
			this.outanimefun=func;
			return this;
		};
		window.browsertop=function(){
			if(window.pageYOffset){//这一条滤去了大部分， 只留了IE678
				return window.pageYOffset;
			}else if(document.documentElement.scrollTop ){//IE678 的非quirk模式
				return document.documentElement.scrollTop;
			}else if(document.body.scrolltop){//IE678 的quirk模式
				return document.body.scrollTop;
			}else{
				return 0;
			}
		}
	}(window),
	function(RfullPage){
		RfullPage.RnewFullPage=function(navul){
			this.navul=null;
			if(navul){
				this.setnavul(navul);
			}
			this.pagenum=1;//初始化页数为1
			this.divarr=[];
			this.ismoving=false;
			var pageobj=this;
			this.topheight=0;
			this.bottomheight=0;
			this.setnavul=function(jquerydiv){
				this.navul=jquerydiv;
				jquerydiv.on("click","li",function(e){
					pageobj.gotopage($(this).attr("data-page"));
				});
			};

			this.addnav=function(navtext,pagenum){
				if(this.navul){
					this.navul.append("<li data-page='"+pagenum+"'>"+navtext+"</li>")
				}
			};




			this.addnewpage=function(jquerydiv,title){//添加新页
				if(this.divarr.length==0){
					this.topheight=jquerydiv.position().top;
				}
				this.bottomheight=jquerydiv.position().top;

				jquerydiv.css("overflow","hidden");
				jquerydiv.height(document.documentElement.clientHeight);
				this.divarr.push(jquerydiv);
				if(this.navul && title){
					this.addnav(title,this.divarr.length)
				}
				return jquerydiv;
			};
			$("body").mousewheel(function(event, delta, deltaX, deltaY) {
				if(deltaY>0 && !pageobj.ismoving){//向上滚
					if(pageobj.bottomheight<(browsertop()-10)){//在底部
						pageobj.gotopage(pageobj.divarr.length,true);
						return false;
					}else if(pageobj.pagenum!=1){//滚动条高度大于顶部的高度
						pageobj.gotopage(pageobj.pagenum-1);
						return false;
					}
				}else if(deltaY<0 && !pageobj.ismoving){//向下滚
					if(browsertop()<(pageobj.topheight-(10))){ //在顶部时
						pageobj.gotopage(1,true);
						return false;
					}else{//不在顶部
						if(pageobj.pagenum!=pageobj.divarr.length){ //不在最后一个
							pageobj.gotopage(pageobj.pagenum+1);
							return false;
						}
					}
				}
				if(pageobj.ismoving){
					return false;
				}
			});
			this.getpage=function(pagenum){//得到对应页的jquery对象
				return this.divarr[(pagenum-1)];
			};
			this.gotopage=function(pagenum,isskipanime){//跳转到指定页
				if(this.getpage(this.pagenum).outanimefun && this.pagenum!=pagenum){
					this.getpage(this.pagenum).outanimefun();
				}


			if(this.navul){
				this.navul.children("li").each(function(i,e){
					if($(this).attr("data-page")==pagenum){
						$(this).addClass("navul_li_active");
					}else{
						$(this).removeClass("navul_li_active");
					}
				});
			}



				this.pagenum=parseInt(pagenum);

				this.ismoving=true;
				if(!isskipanime){
					isskipanime=false;
				}
				if(this.getpage(pagenum).animefun && !isskipanime){
					this.getpage(pagenum).animefun();
				}
				$("html,body").stop().animate({scrollTop:(pagenum-1)*document.documentElement.clientHeight+pageobj.topheight},"2000",function(e){
					pageobj.ismoving=false;
			})
			};

			$(window).bind("resize",function(e) {
				$.each(pageobj.divarr,function(i,e){
					if(i==0){
						pageobj.topheight=e.position().top;
					}
					pageobj.bottomheight=e.position().top;
					e.height(document.documentElement.clientHeight);
					pageobj.gotopage(pageobj.pagenum,true);
				})
			});
		}

	}(RfullPage)