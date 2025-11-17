<!DOCTYPE HTML>
<html>
<?php @include('partials/head.php') ?>
<body class="is-preload">
    <div id="wrapper">
        <div id="main">
            <div class="inner">
                <?php @include('partials/header.php') ?>
                <section>
                    <h2>Contact me</h2>
                    <p>Need a new website? Need updates or new features to your current website? Let's have a Google Hangouts video conference meeting and see what we can figure out! Send me a message below with more details about your company/project, and I'll get back to you within 24 hours.</p>
                    <form method="post" action="#">
                        <div class="row gtr-uniform">
                            <div class="col-6 col-12-xsmall">
                                <input type="text" name="Name" id="demo-name" value="" placeholder="Name" />
                            </div>
                            <div class="col-6 col-12-xsmall">
                                <input type="email" name="Email" id="demo-email" value="" placeholder="Email" />
                            </div>
                            <div class="col-12">
                                <textarea name="Message" id="demo-message" placeholder="Enter your message" rows="6"></textarea>
                            </div>
                            <div class="g-recaptcha" data-sitekey="6LdWem8pAAAAAF9G97nfRRuvBIcXZJFTM13j_LQ7"></div>
                            <div class="col-12">
                                <ul class="actions">
                                    <li><input type="submit" value="Send Message" class="primary" /></li>
                                </ul>
                            </div>
                        </div>
                    </form>
                </section>
            </div>
        </div>
        <?php @include('partials/sidebar.php') ?>
    </div>
    <?php @include('partials/footer.php') ?>
</body>
</html>