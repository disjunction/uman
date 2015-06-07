<?php
namespace Uman\Repository;

use Uman\Entity\User;
use Doctrine\ORM\EntityRepository;

class UserRepository extends EntityRepository
{
    /**
     * Stores User and corresponding UserGroupLink records
     * based on "serialized" Object:
     * serilazed sample: [
     * 		name => 'Some Name',
     * 		login => 's.name',
     * 		groupIds => ['group1', 'group2']
     * ]
     * @param  array $serialized [description]
     * @return User
     */
    public function persistSerialized($serialized)
    {
        // get all groups
        if ($serialized['groupIds']) {
            $sql = '
                SELECT g FROM Uman\Entity\Group g
                WHERE g.name IN (:groupIds)
            ';
            $query = $this->_em->createQuery($sql);
            $query->setParameter('groupIds', $serialized['groupIds']);
            $groups = $query->getResult();
        } else {
            $groups = [];
        }

        // save the entity itself
        $user = $this->_em->getRepository('Uman\Entity\User')->find($serialized['login']);
        if ($user) {
            $user->name = $serialized['name'];
            $user->login = $serialized['login'];
        } else {
            $user = new User($serialized['name'], $serialized['login']);
            $this->_em->persist($user);
        }

        $user->groups = $groups;
        return $user;
    }
}
