<?php
namespace TestUman\Repository;
use Uman\Entity\User;
use Uman\Entity\Group;
use Uman\DoctrineBootstrap;

class UserRepositoryTest extends \PHPUnit_Framework_TestCase
{
    public function testPersistSerialized()
    {
        $em = DoctrineBootstrap::makeEntityManager('tests/unittest.sqlite');
        $serialized = [
            'name' => 'Peter Norton2',
            'login' => 'p.norton2',
            'groupIds' => ['group1', 'group2', 'group3']
        ];
        $em->getRepository('Uman\Entity\User')->persistSerialized($serialized);
    }
}
