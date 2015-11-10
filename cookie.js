
  <script type="text/javascript">

               
                 var p = '<%- page %>';
                 var t = '<%- locals.issuetitle%>';
                 var l = '<%- locals.location%>';
                (Cookies.get('itemTabView')=="gallery")?$(".galleryTabTitle").addClass("active"):$(".listTabTitle").addClass("active");
                (Cookies.get('itemTabView')=="gallery")?($(".galleryTabContent").addClass("active"), galleryAjax(p, t, l)):$(".listTabContent").addClass("active");

                $(".listTabTitle").click(function() {
                  $(".listTabTitle").addClass("active");
                  $(".listTabContent").addClass("active");
                  $(".galleryTabTitle").removeClass("active");
                  $(".galleryTabContent").removeClass("active");
                  Cookies.set('itemTabView', "list",{ expires: 30 , path:'/'});
                });
                $(".galleryTabTitle").click(function() {

                 if($('.galleryTabContent').size() < 1000){
                  galleryAjax(p, t, l);
                 }


                  $(".listTabTitle").removeClass("active");
                  $(".listTabContent").removeClass("active");
                  $(".galleryTabTitle").addClass("active");
                  $(".galleryTabContent").addClass("active");
                  Cookies.set('itemTabView', "gallery",{ expires: 30 , path:'/'});
                });
                function galleryAjax(page, title, location){
                  page = page || 1;
                  title = title || '';
                  location = location || '';
                  $.ajax({ url: 'index_gallery.html?page='+page+'&title='+title+'&location='+location, type : 'GET', success: function(data){
                          $('.galleryTabContent').html(data);
                  }});
                }

</script>
