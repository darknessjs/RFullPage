

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


	function (RfullPage){
		RfullPage.Rbasic=function(navul){
			this.navul=null;
			var pageobj=this;
			this.setnavul=function(jquerydiv){
				this.navul=jquerydiv;
				jquerydiv.on("click","li",function(e){
					pageobj.gotopage($(this).attr("data-page"));
				});
			};
			if(navul){
				this.setnavul(navul);
			}
			this.pagenum=1;//初始化页数为1
			this.divarr=[];
			this.ismoving=false;
			this.ismousewhell=true;


			this.setismousewhell=function(ismousewhell){
				this.ismousewhell=ismousewhell;
			};
			this.navulactivecss="";
			this.setnavulactivecss=function(cssname){
				this.navulactivecss=cssname;
			};
			this.addnav=function(navtext,pagenum,isaddactive = true ){
				if(this.navul){
					this.navul.append("<li data-page='"+pagenum+"' data-isaddactive='"+isaddactive+"'>"+navtext+"</li>")
				}
			};

			this.getpage=function(pagenum){//得到对应页的jquery对象
				return this.divarr[(pagenum-1)];
			};
		}
	}(RfullPage),

	function(RfullPage){
		RfullPage.RnewFullPage=function(navul){
			var pageobj=this;
			RfullPage.Rbasic.call(this,navul);

			this.getfullpageheight=function(){
				return document.documentElement.clientHeight;
			};

			this.topheight=0;
			this.bottomheight=0;


			this.addnewpage=function(jquerydiv,title){//添加新页
				if(this.divarr.length==0){
					this.topheight=jquerydiv.position().top;
				}
				this.bottomheight=jquerydiv.position().top;

				jquerydiv.css("overflow","hidden");
				jquerydiv.height(this.getfullpageheight());
				this.divarr.push(jquerydiv);
				if(this.navul && title){
					this.addnav(title,this.divarr.length)
				}
				return jquerydiv;
			};
			if(this.ismousewhell){
				$("body").mousewheel(function(event, delta, deltaX, deltaY) {
					if(deltaY>0 && !pageobj.ismoving){//向上滚
						if(pageobj.bottomheight<(browsertop()-10)){//在底部
							pageobj.gotopage(pageobj.divarr.length,true);
							if(pageobj.navul){
								pageobj.navul.stop().fadeIn("fast");
							}
							return false;
						}else if(pageobj.pagenum!=1){//滚动条高度大于顶部的高度
							pageobj.gotopage(pageobj.pagenum-1);
							return false;
						}else{
							if(pageobj.navul){
								pageobj.navul.stop().fadeOut("fast");
							}
						}
					}else if(deltaY<0 && !pageobj.ismoving){//向下滚
						if(browsertop()<(pageobj.topheight-(10))){ //在顶部时
							pageobj.gotopage(1,true);
							if(pageobj.navul){
								pageobj.navul.stop().fadeIn("fast");
							}
							return false;
						}else{//不在顶部
							if(pageobj.pagenum!=pageobj.divarr.length){ //不在最后一个
								pageobj.gotopage(pageobj.pagenum+1);
								return false;
							}else{
								//if(pageobj.navul){
								//	pageobj.navul.stop().fadeOut("fast");
								//}
							}
						}
					}
					if(pageobj.ismoving){
						return false;
					}
				});
			}



			this.gotopage=function(pagenum,isskipanime){//跳转到指定页
				if(this.getpage(this.pagenum).outanimefun && this.pagenum!=pagenum){
					this.getpage(this.pagenum).outanimefun();
				}
				if(this.navul){
					this.navul.children("li").each(function(i,e){
						if($(this).attr("data-page")==pagenum && $(this).attr("data-isaddactive")=="true"){
							$(this).addClass(pageobj.navulactivecss);
						}else{
							$(this).removeClass(pageobj.navulactivecss);
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
				$("html,body").stop().animate({scrollTop:(pagenum-1)*pageobj.getfullpageheight()+pageobj.topheight},"2000",function(e){
					pageobj.ismoving=false;
				});
			};
			$(window).bind("resize",function(e) {
				if(pageobj.getpage(pageobj.pagenum).animefun){
					pageobj.getpage(pageobj.pagenum).animefun();
				}
				$.each(pageobj.divarr,function(i,e){
					if(i==0){
						pageobj.topheight=e.position().top;
					}
					pageobj.bottomheight=e.position().top;
					e.height(pageobj.getfullpageheight());
					pageobj.gotopage(pageobj.pagenum,true);
				})
			});
		}

	}(RfullPage),

	function(RfullPage){
		RfullPage.RnewBannerFullPage=function(parentjqueryul,navul){
			var pageobj=this;
			RfullPage.Rbasic.call(this,(navul?navul:null));
			parentjqueryul.css("position","relative");
			parentjqueryul.children("li").each(function(i,e){
				if(navul){
					navul.append("<li data-page='"+(i-(-1))+"'></li>")
				}
				pageobj.divarr.push($(this));
				$(this).css("width","100%").css("height","100%").css("left",i*(parentjqueryul.width())+"px").css("top","0px").css("position","absolute");
				if(i!=0){
					$(this).animate({opacity:"0"});
				}
			});

			if(navul){
				navul.on("click","li",function(e){
					pageobj.gotopage($(this).attr("data-page"));
				});
			}


			this.gotopage=function(pagenum){
				navul.children("li:eq("+(this.pagenum-1)+")").removeClass(this.navulactivecss);
				navul.children("li:eq("+(pagenum-1)+")").addClass(this.navulactivecss);
				if(pagenum>this.pagenum){
					pageobj.divarr[pagenum-1].css("left",100+"px").stop().animate({opacity:"1",left:0},"slow");
					pageobj.divarr[this.pagenum-1].stop().animate({opacity:"0",left:-100},"slow");
				}else if(pagenum<this.pagenum){
					pageobj.divarr[pagenum-1].css("left",-(100)+"px").stop().animate({opacity:"1",left:0},"slow");
					pageobj.divarr[this.pagenum-1].stop().animate({opacity:"0",left:100},"slow");
				}else{
					return false;
				}
				this.pagenum=pagenum;
				this.startanime();
			};
			this.isanime=true;
			this.animespeed=5000;
			this.startanime=function(){
				if(this.isanime){
					if(this.animet)
						window.clearInterval(this.animet);
					this.animet=window.setInterval(function(){pageobj.gotopage((pageobj.divarr.length==pageobj.pagenum?1:(pageobj.pagenum-(-1))))},pageobj.animespeed);
				}
			}
		}
	}(RfullPage);