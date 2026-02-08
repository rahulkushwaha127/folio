<!DOCTYPE HTML>
<html>
<?php require_once __DIR__ . '/config.php'; ?>
<?php @include('partials/head.php') ?>
<body class="is-preload">
    <div id="wrapper">
        <div id="main">
            <div class="inner">
                <?php @include('partials/header.php') ?>
                <section class="page-content">
                    <header class="main">
                        <h1>Contact me</h1>
                        <p class="page-intro">Need a new site, updates to an existing one, or a quick chat? Send a message below—I usually reply within 24 hours.</p>
                    </header>

                    <?php
                    if (isset($_GET['success']) && $_GET['success'] == '1') {
                        echo '<div class="alert alert-success"><strong>Success!</strong> Your message has been sent. I\'ll get back to you within 24 hours.</div>';
                    }
                    if (isset($_GET['error'])) {
                        echo '<div class="alert alert-error"><strong>Error:</strong> ' . htmlspecialchars($_GET['error']) . '</div>';
                    }
                    ?>

                    <div class="contact-options box">
                        <p class="contact-quick">You can also reach me directly:</p>
                        <ul class="contact-quick-list">
                            <li><span class="icon solid fa-envelope"></span> <a href="mailto:rahulkushwaha14949@gmail.com">rahulkushwaha14949@gmail.com</a></li>
                            <li><span class="icon solid fa-phone"></span> <a href="tel:+917383524273">+91 7383524273</a></li>
                        </ul>
                    </div>

                    <div class="box form-box">
                        <h2 class="form-title">Send a message</h2>
                        <form method="post" action="/contact-handler" class="contact-form">
                            <div class="row gtr-uniform">
                                <div class="col-6 col-12-xsmall">
                                    <label for="demo-name" class="form-label">Name</label>
                                    <input type="text" name="Name" id="demo-name" value="" placeholder="Your name" required />
                                </div>
                                <div class="col-6 col-12-xsmall">
                                    <label for="demo-email" class="form-label">Email</label>
                                    <input type="email" name="Email" id="demo-email" value="" placeholder="your@email.com" required />
                                </div>
                                <div class="col-12">
                                    <label for="demo-message" class="form-label">Message</label>
                                    <textarea name="Message" id="demo-message" placeholder="Tell me about your project or question…" rows="6" required></textarea>
                                </div>
                                <input type="hidden" name="g-recaptcha-response" id="recaptcha-token" value="" />
                                <div class="col-12">
                                    <ul class="actions">
                                        <li><input type="submit" value="Send Message" class="primary" id="contact-submit" /></li>
                                    </ul>
                                </div>
                            </div>
                        </form>
                        <script src="https://www.google.com/recaptcha/api.js?render=<?php echo htmlspecialchars(RECAPTCHA_SITE_KEY); ?>"></script>
                        <script>
                        document.querySelector('.contact-form').addEventListener('submit', function(e) {
                            e.preventDefault();
                            var form = this;
                            var submitBtn = document.getElementById('contact-submit');
                            if (submitBtn) submitBtn.disabled = true;
                            grecaptcha.ready(function() {
                                grecaptcha.execute('<?php echo addslashes(RECAPTCHA_SITE_KEY); ?>', { action: 'contact' }).then(function(token) {
                                    document.getElementById('recaptcha-token').value = token;
                                    form.submit();
                                });
                            });
                        });
                        </script>
                    </div>
                </section>
            </div>
        </div>
        <?php @include('partials/sidebar.php') ?>
    </div>
    <?php @include('partials/footer.php') ?>
</body>
</html>