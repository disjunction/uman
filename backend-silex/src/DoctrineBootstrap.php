<?php
namespace Uman;

use Doctrine\ORM\Tools\Setup;
use Doctrine\ORM\EntityManager;

require_once __DIR__ . "/../vendor/autoload.php";

class DoctrineBootstrap
{
    public static function makeEntityManager($fileName = 'uman.sqlite')
    {
        $config = Setup::createAnnotationMetadataConfiguration(array(__DIR__ . '/Entity'), $isDevMode = true);
        $conn = array(
            'driver' => 'pdo_sqlite',
            'path' => __DIR__ . '/../' . $fileName,
        );
        return EntityManager::create($conn, $config);
    }
}
