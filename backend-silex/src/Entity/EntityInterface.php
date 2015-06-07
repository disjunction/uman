<?php
namespace Uman\Entity;

interface EntityInterface
{
    /**
     * @return string
     */
    function getId();

    /**
     * converts an object to simple assoc,
     * suitable for JSON-encoding and sending to client
     * @return array
     */
    function serialize();

    /**
     * Generates a new object using the assoc array
     *
     * @param  array
     * @return EntityInterface
     */
    static function unserialize($array);

    /**
     * wrapper for ::serialize() processing entire array
     * @param  EntityInterface[]
     * @return array
     */
    static function serializeArray($array);
}
