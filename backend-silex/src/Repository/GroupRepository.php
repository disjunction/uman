<?php
namespace Uman\Repository;

use Uman\Entity\User;
use Doctrine\ORM\EntityRepository;

class GroupRepository extends EntityRepository
{
    public function getSummaryWithMemberCount()
    {
        $sql = '
            SELECT name, COUNT(groupName) as memberCount
            FROM Groups
            LEFT JOIN UserGroupLink ON name=groupName
            GROUP BY name
            ORDER BY name
        ';
        $query = $this->_em->getConnection()->query($sql);
        return $query->fetchAll(\PDO::FETCH_ASSOC);
    }
}
