<?php
// Doctrine's cli-config.php

require_once "src/DoctrineBootstrap.php";

return \Doctrine\ORM\Tools\Console\ConsoleRunner::createHelperSet(
    \Uman\DoctrineBootstrap::makeEntityManager()
);
