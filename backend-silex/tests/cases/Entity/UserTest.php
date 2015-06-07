<?php
namespace TestUman\Entity;
use Uman\Entity\User;
use Uman\Entity\Group;
use Uman\DoctrineBootstrap;

class UserTest extends \PHPUnit_Framework_TestCase
{
    public function testContstructor()
    {
        $user = new User('Fabien Potencier', 'fpotencier');
        $this->assertEquals('fpotencier', $user->login);
        $this->assertEquals('Fabien Potencier', $user->name);
    }

    private function truncateTable($em, $tableName) {
        $connection = $em->getConnection();
        $dbPlatform = $connection->getDatabasePlatform();
        $q = $dbPlatform->getTruncateTableSql($tableName);
        $connection->executeUpdate($q);
    }

    public function testSerialize() {
        $user = new User('Benjamin Eberlei', 'beberlei');
        $group = new Group('gr1');
        $user->groups->add($group);
        $group = new Group('gr2');
        $user->groups->add($group);
        $this->assertEquals([
            'login' => 'beberlei',
            'name' => 'Benjamin Eberlei',
            'groupIds' => ['gr1', 'gr2']
        ], $user->serialize());
    }

    public function testPersistance() {
        $em = DoctrineBootstrap::makeEntityManager('tests/unittest.sqlite');

        $this->truncateTable($em, 'User');
        $this->truncateTable($em, 'Groups');
        $this->truncateTable($em, 'UserGroupLink');

        $user = new User('Fabien Potencier', 'fpotencier');
        $em->persist($user);

        $group = new Group('group1');
        $em->persist($group);
        $user->groups->add($group);

        $group = new Group('group2');
        $em->persist($group);
        $user->groups->add($group);

        $em->flush($user);
    }

    /**
     * uses data prepared in the previous test (testPersistence)
     */
    public function testReading() {
        $em = DoctrineBootstrap::makeEntityManager('tests/unittest.sqlite');

        $logger = new \Doctrine\DBAL\Logging\DebugStack();
        $em->getConnection()
            ->getConfiguration()
            ->setSQLLogger($logger);

        $repo = $em->getRepository('Uman\Entity\User');
        $user = $repo->find('fpotencier');
        if (!$user) {
            $this->fail('user not found');
        }
        $this->assertCount(2, $user->groups->toArray());
    }
}
