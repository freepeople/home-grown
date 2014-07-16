$('.slider1').on('cycle-after', function(){
    console.log('after slider 1');
})
.on('cycle-bootstrap', function(){
    console.log('%c show only on init/bootstrap of slider 1', 'background: #222; color: #bada55');
});

$('.slider2').on('cycle-after', function(){
    console.log('after slider 2');
})
.on('cycle-before', function(){
    console.log('before slider 2');
});