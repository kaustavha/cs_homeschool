var i = 0, rs = 670, stopPropogation = false;
function apply() {
    var rsa = 4000 + (rs * Math.random());
    var interested = "Hi, I’m a new UWaterloo grad and self taught programmer. I have experience working on full-stack web, mobile, devops, SOA, data-science/visualization & blockchain. At my last internship I also had a chance to drive product decisions, onboard new developers, resolve developer disputes, help manage a conference, publish docs & a blog post. I’ve also been a co-founder at a music industry startup which was featured on Dragons Den, Logistics Director for a large (~1000 people) hackathon and presented projects at 5 hackathons. Please see my resume at bit.ly/khaldarcv or via kaustav.me & reach out if I’d be a fit.";
    if ($(".add-note-button > a.g-button.blue:visible").length == 0) {
        $(".browse_startups_table_row:visible").first().click();
    }
    $(".add-note-button > a.g-button.blue:visible").first().click();
    $(".interested-note:visible").first().val(interested);
    $("a.g-button.blue.interested-with-note-button:visible").first().click();
    $(".js-done").click();
    $("html, body").animate({ scrollTop: $(document).height() - $(window).height() });
    i++;
    if (i % 10 == 0) { console.log(i); }
    if (!stopPropogation) {
        setTimeout(apply, rsa);
    } else {
        console.log('stopping propagation');
    }
}
