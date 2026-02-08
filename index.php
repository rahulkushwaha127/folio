<!DOCTYPE HTML>
<html>
<?php @include('partials/head.php') ?>
<body class="is-preload">
    <div id="wrapper">
        <div id="main">
            <div class="inner">
                <?php @include('partials/header.php') ?>
                <section id="banner">
                    <div class="content">
                        <header>
                            <h1>Hi, I'm Rahul Kushwaha</h1>
                            <p class="hero-role">Full‑stack developer</p>
                        </header>
                        <p class="hero-tagline">I build web &amp; mobile apps with Laravel, Vue, React &amp; PHP.</p>
                        <p>This site showcases projects I've built and worked on with teams, and how to get in touch if you need help with yours.</p>
                        <ul class="actions">
                            <li><a href="/portfolio" class="button big">Check out my projects</a></li>
                            <li><a href="/services" class="button big alt">View services</a></li>
                        </ul>
                    </div>
                    <span class="image object hero-image">
                        <img src="me.png" alt="Rahul Kushwaha" />
                    </span>
                </section>
            </div>
        </div>
        <?php @include('partials/sidebar.php') ?>
    </div>
    <?php @include('partials/footer.php') ?>
</body>
</html>